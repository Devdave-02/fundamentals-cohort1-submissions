// Represents a single doctor
export interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  contactInfo: string;
  appointments: [];
  __v: number;
}

// Represents the API response structure
export interface DoctorsResponse {
  status: "success" | "error";
  message: string;
  data: Doctor[];
}
