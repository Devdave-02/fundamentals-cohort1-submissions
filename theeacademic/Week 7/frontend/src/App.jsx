import React from 'react';
import UserList from './components/UserList.jsx';
import TransactionForm from './components/TransactionForm.jsx';

export default function App() {
  return (
    <div className="container">
      <header>
        <h1>FlowServe</h1>
        <p>Scalable and Reliable APIs — Demo UI</p>
      </header>

      <main className="grid">
        <section>
          <h2>Users</h2>
          <UserList />
        </section>
        <section>
          <h2>Simulate Transaction</h2>
          <TransactionForm />
        </section>
      </main>

      <footer>
        <small>© {new Date().getFullYear()} FlowServe</small>
      </footer>
    </div>
  );
}
