import "./input.css";
const Input = ({ type, placeholder, value, event }) => {
  return (
    <div className="input-control">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={event}
        className="input"
      />
    </div>
  );
};

export default Input;
