import React from 'react';

interface TextareaProps {
  value: any[];
}

const Textarea: React.FC<TextareaProps> = ({ value, children }) => {
  const textarea = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (textarea.current) {
      textarea.current.scrollTop = textarea.current.scrollHeight;
    }
  }, [value]);

  return (
    <div ref={textarea} className="message-box">
      {value.map(({ id, message, from }) => (
        <div key={id}>
          <strong>{`${from}:`}</strong> {`${message}`}
        </div>
      ))}
      {children}
    </div>
  );
};

export default Textarea;
