import React from 'react';
import Form from './components/Form';

const App = () => {
  const appStyle = {
    height: '250px',
    display: 'flex',
  };

  const handleSubmit = (data) => {
    const json = JSON.stringify(data, null, 4);
    console.clear();
    console.log(json);
  };
  return (
    <div style={appStyle}>
      <Form onSubmit={handleSubmit} />
    </div>
  );
};

export default App;
