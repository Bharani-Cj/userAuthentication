import { RxDotFilled } from 'react-icons/rx';
import { MdSettings, MdOutlineCancel } from 'react-icons/md';
import { useEffect, useState } from 'react';

export default function Home() {
  const [userDetails, setUserDetails] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fet() {
      const response = await fetch(
        'https://user-authentication-8w3s.onrender.com/api/v1/getAllUser',
        {
          method: 'GET',
          headers: {
            authentication: `Bearer ${token}`,
          },
        }
      );
      const currentData = await response.json();
      const actUser = currentData.data;
      setUserDetails(actUser);
    }
    fet();
  }, [token]);

  return (
    <div className="table-container">
      <h1 style={{ color: 'green', textAlign: 'center' }}>USER DETAILS</h1>
      <table id="customers">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date Created</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {userDetails.map((el) => {
            return <UserDatas user={el} key={el._id} />;
          })}
        </tbody>
      </table>
    </div>
  );
}

function UserDatas({ user }) {
  return (
    <tr>
      <td>{user.userName}</td>
      <td>{user.dateCreated}</td>
      <td>{user.role}</td>
      <td className="status">
        <RxDotFilled color={user.active ? 'green' : 'red'} size="2rem" />
        {user.active ? 'Active' : 'Suspended'}
      </td>
      <td className="action">
        <span>
          <MdSettings size="1.3rem" color="blue" />
        </span>
        <span>
          <MdOutlineCancel size="1.3rem" color="red" />
        </span>
      </td>
    </tr>
  );
}
