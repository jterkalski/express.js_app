import Form from './Form';

const Login = () => {
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

export default Login;
