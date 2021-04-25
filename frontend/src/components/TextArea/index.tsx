import React from 'react';
import './styles.scss';

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
      {value.map(({ id, content, answer, user }) => (
        <div key={id} className="d-block p-1">
          <img className="m-1" height={24} src={user.avatar} alt="avatar" />
          <strong>{`${user.nickname}:`}</strong> {`${content || answer}`}
        </div>
      ))}
      {children}
    </div>
  );
};

export default Textarea;
