import React, { useState } from 'react';

function Session() {
  const [token, setToken] = useState(null);

  return (
      <div>
        <p>You clicked {token} times</p>
        <button onClick={() => setToken('abc')}>
          Click me
        </button>
      </div>
  );
}

export default Session;
