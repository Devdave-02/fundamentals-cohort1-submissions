# Notification System Design Document

## 1. Architecture Overview

This system implements an asynchronous, scalable notification-processing pipeline using:

* A **React frontend** (job submission + job status display)
* A **Node.js backend API** (job creation + status retrieval)
* **RabbitMQ** as the message broker
* A **Worker service** for processing notification jobs
* **MongoDB** as the persistence layer

All components communicate using clear boundaries to ensure high throughput, fault tolerance, and horizontal scalability.

---

## 2. Architecture Diagram

```
┌────────────┐        POST /notifications           ┌──────────────┐
│  Frontend  │ ───────────────────────────────────▶ │   Backend     │
│  (React)   │ ◀─────────────────────────────────── │  API Server   │
└─────┬──────┘        GET /notifications           └──────┬───────┘
      │                                                   │
      │                                                   ▼
      │                                           ┌───────────────┐
      │                                           │   MongoDB      │
      │                                           └──────┬────────┘
      │                                                   │
      │ create job + publish jobId                       │
      │                                                   ▼
      │                                           ┌────────────────┐
      └──────────────────────────────────────────▶│   RabbitMQ      │
                                                  └──────┬─────────┘
                                                         │ consume
                                                         ▼
                                                  ┌──────────────┐
                                                  │   Worker      │
                                                  │ (Processor)   │
                                                  └──────────────┘
```

---

## 3. Components and Responsibilities

### **Frontend (React)**

* Provides input form for sending notifications
* Calls backend API to create a job
* Polls or streams job status updates
* Displays real‑time job list and states

### **Backend API (Node.js + Express)**

* Exposes REST endpoints:

  * `POST /api/notifications`
  * `GET /api/notifications/:id`
  * `GET /api/notifications`
* Creates notification job documents
* Publishes `jobId` to RabbitMQ

### **RabbitMQ Message Queue**

* Decouples the API from the worker
* Handles buffering of jobs
* Enables retry through message requeue

### **Worker (Node.js)**

* Consumes jobs from RabbitMQ
* Loads job from DB
* Calls notification provider mock
* Updates job status
* Implements retry with exponential backoff

### **MongoDB**

* Stores job metadata, logs, attempts
* Used by both API and worker

---

## 4. Scaling Strategy

### **Backend**

* Stateless → scale horizontally behind load balancer
* MongoDB connection pooling for high throughput

### **RabbitMQ**

* Increase queue partitions
* Add more consumers
* Use worker clusters

### **Workers**

* Workers scale horizontally to multiply throughput
* Each worker processes messages independently

### **Frontend**

* CDN + static assets → highly scalable
* Polling interval can adjust dynamically under load

---

## 5. Fault Tolerance Strategy

### **If backend crashes**

* No messages lost because job creation happens before queue publish

### **If worker crashes**

* Unacked RabbitMQ messages return to queue

### **If database becomes slow**

* Worker slows down → backlog grows
* Queue absorbs burst traffic (buffering)
* System degrades gracefully but does not fail

### **If provider fails**

* Worker retries with exponential backoff:

  * 1st retry: 2 seconds
  * 2nd retry: 4 seconds
  * 3rd retry: 8 seconds

---

## 6. Queueing Model & Retry Flow

```
POST Job → Save in DB → Publish to Queue → Worker Consumes → Provider Call
                                  │
                             Failure?
                                  ▼
                     Retry with Backoff (max 3)
                                  │
               Success? ──────────┴────────── Failure?
                  │                         │
           status=delivered         status=failed
```

* Messages are ACKed only after success
* Failed attempts requeued with delay
* After max retries, job is marked "failed"

---

## 7. API Design

### **Create Notification**

```
POST /api/notifications
Body:
{
  "email": "user@example.com",
  "message": "Hello!"
}
```

Response

```
{
  "jobId": "651...",
  "status": "queued"
}
```

### **Get Notification Status**

```
GET /api/notifications/:id
```

### **List All Jobs**

```
GET /api/notifications
```

---

## 8. Database Schema (MongoDB)

### **Job Model**

```
{
  _id: ObjectId,
  email: String,
  message: String,
  status: "queued" | "processing" | "delivered" | "failed",
  attempts: Number,
  logs: [
    {
      timestamp: Date,
      message: String
    }
  ],
  createdAt: Date
}
```

Indexed on:

* `status`
* `createdAt`

---

# 9. Design Defense

## **Why this architecture?**

* It separates concerns clearly: API, queue, worker.
* Designed to handle high‑volume asynchronous workloads.
* Queue absorbs spikes; workers scale independently.

## **Handling 50,000 notifications/min (833/sec)**

Scaling path:

1. **API**: Stateless → 10–20 instances easily handle 5k–10k RPS.
2. **Queue**: RabbitMQ clusters handle millions of messages per minute.
3. **Workers**: If one worker processes 50 msg/sec, 20 workers handle 1,000 msg/sec.
4. Add horizontal scaling to reach required throughput.

## **Graceful Degradation Under Load**

* Queue grows → system remains responsive.
* Worker throughput slows but no errors.
* Frontend polling interval increases.
* Providers delaying does not collapse the system.

## **Potential Bottlenecks & Mitigations**

### **1. MongoDB writes become slow**

Mitigation:

* Add MongoDB replica sets
* Use sharding

### **2. Worker cannot keep up with queue**

Mitigation:

* Add more worker replicas
* Increase prefetch limits

### **3. RabbitMQ queue overload**

Mitigation:

* Use quorum queues
* Add more queue partitions

### **4. Backend API overloaded**

Mitigation:

* Autoscale backend pods horizontally

---

This document provides a full architectural overview, scaling plan, resiliency strategy, and defense justification for a production‑grade asynchronous notification processing system.
