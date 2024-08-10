import React, {useRef} from 'react';

function RenderCounter() {
  const renderCounter = useRef(0);
  renderCounter.current = renderCounter.current + 1;
  return (
    <h1>
      Render Count: {renderCounter.current}
    </h1>
  );
}

export default RenderCounter;