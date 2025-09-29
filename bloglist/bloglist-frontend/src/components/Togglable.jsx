import { useImperativeHandle, useState } from "react";
import { Button, Card } from "react-bootstrap";

const Togglable = ({ buttonLabel, children, ref }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };
  useImperativeHandle(ref, () => {
    return { toggleVisibility };
  });
  return (
    <Card className="mb-3 bg-light border-0 shadow-sm">
      <Card.Body>
        {!visible && (
          <Button variant="primary" onClick={toggleVisibility}>
            {buttonLabel}
          </Button>
        )}
        {visible && (
          <div>
            {children}
            <Button
              variant="secondary"
              onClick={toggleVisibility}
              className="mt-2"
            >
              Cancel
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default Togglable;
