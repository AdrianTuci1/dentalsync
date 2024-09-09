
function SignIn({ onLogin }: { onLogin: () => void }) {
  const handleSignIn = () => {
    // Simulate sign-in logic
    onLogin();
  };

  return (
    <div>
      <h1>Sign In</h1>
      <button onClick={handleSignIn}>Sign In</button>
    </div>
  );
}

export default SignIn;
