import React from 'react';
import Field from './Field';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Form = ({ onSubmit }) => {
  const history = useHistory();
  const usernameRef = React.useRef();
  const passwordRef = React.useRef();

  const formStyle = {
    margin: 'auto',
    padding: '10px',
    border: '1px solid #c9c9c9',
    borderRadius: '5px',
    background: '#f5f5f5',
    width: '220px',
    display: 'block',
  };

  const submitStyle = {
    margin: '10px 0 0 0',
    padding: '7px 10px',
    border: '1px solid #efffff',
    borderRadius: '3px',
    background: '#f5c61e',
    width: '100%',
    fontSize: '15px',
    color: 'black',
    display: 'block',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userToPost = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };
    const response = await axios
      .post('http://localhost:5000/login', userToPost)
      .catch((error) => console.log('Error: ', error));
    if (response && response.data) {
      console.log(response);
      console.log(response.data);
    }
  };
  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <Field ref={usernameRef} label="Username:" type="text" />
      <Field ref={passwordRef} label="Password:" type="password" />
      <div>
        <button style={submitStyle} type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};

export default Form;
