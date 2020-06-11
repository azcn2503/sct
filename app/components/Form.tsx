import React, { useState } from 'react';

import styles from './Form.scss';

function FieldLabel(props: any) {
  return <div className={styles.fieldLabel}>{props.label || props.id}</div>;
}

function FieldValue(props: any) {
  return (
    <div className={styles.fieldValue}>
      {(function() {
        switch (props.type) {
          case 'number':
            return (
              <input
                type="number"
                defaultValue={props.defaultValue}
                onChange={e =>
                  props.onChange({ id: props.id, value: e.target.value })
                }
              />
            );
          default:
            return (
              <input
                type="text"
                defaultValue={props.defaultValue}
                onChange={e =>
                  props.onChange({ id: props.id, value: e.target.value })
                }
              />
            );
        }
      })()}
    </div>
  );
}

function Field(props: any) {
  return (
    <div className={styles.field}>
      <FieldLabel {...props} />
      <FieldValue {...props} />
    </div>
  );
}

export default function Form(props: any) {
  function getDefaultValues() {
    const defaultValues = {};
    props.config.forEach(c => {
      defaultValues[c.id] = c.defaultValue;
    });
    return defaultValues;
  }
  const [values, setValues] = useState(props.values || getDefaultValues());

  function setFieldValue({ id, value }) {
    const nextValues = {
      ...values,
      [id]: value
    };
    setValues(nextValues);
    props.onChange(nextValues);
  }

  return (
    <form className={styles.form}>
      {props.config.map(field => (
        <Field
          key={field.id}
          {...field}
          defaultValue={values[field.id] || field.defaultValue}
          onChange={setFieldValue}
        />
      ))}
    </form>
  );
}
