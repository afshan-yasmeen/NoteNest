import React from 'react';

export default function Alert(props) {
  // Check if alert is not null or undefined before rendering
  return (
    props.alert && (
      <div className={`alert alert-${props.alert.type} alert-dismissible fade show m-2`} role="alert">
        <strong>{props.alert.type.toUpperCase()}</strong>: {props.alert.msg}
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    )
  );
}