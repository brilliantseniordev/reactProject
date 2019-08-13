import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { useInput, FieldTitle } from 'ra-core';

import sanitizeRestProps from './sanitizeRestProps';
import InputHelperText from './InputHelperText';

/**
 * Convert Date object to String
 *
 * @param {Date} v value to convert
 * @returns {String} A standardized date (yyyy-MM-dd), to be passed to an <input type="date" />
 */
const convertDateToString = v => {
    if (!(v instanceof Date) || isNaN(v.getDate())) return;
    const pad = '00';
    const yyyy = v.getFullYear().toString();
    const MM = (v.getMonth() + 1).toString();
    const dd = v.getDate().toString();
    return `${yyyy}-${(pad + MM).slice(-2)}-${(pad + dd).slice(-2)}`;
};

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const format = value => {
    // null, undefined and empty string values should not go through dateFormatter
    // otherwise, it returns undefined and will make the input an uncontrolled one.
    if (value == null || value === '') {
        return '';
    }

    if (value instanceof Date) {
        return convertDateToString(value);
    }

    // valid dates should not be converted
    if (dateRegex.test(value)) {
        return value;
    }

    return convertDateToString(new Date(value));
};

export const DateInput = ({
    label,
    options,
    source,
    resource,
    helperText,
    onBlur,
    onChange,
    onFocus,
    validate,
    ...rest
}) => {
    const {
        id,
        input,
        isRequired,
        meta: { error, touched },
    } = useInput({
        format,
        onBlur,
        onChange,
        onFocus,
        resource,
        source,
        validate,
        ...rest,
    });

    return (
        <TextField
            id={id}
            {...input}
            type="date"
            margin="normal"
            error={!!(touched && error)}
            helperText={
                <InputHelperText
                    touched={touched}
                    error={error}
                    helperText={helperText}
                />
            }
            label={
                <FieldTitle
                    label={label}
                    source={source}
                    resource={resource}
                    isRequired={isRequired}
                />
            }
            InputLabelProps={{
                shrink: true,
            }}
            {...options}
            {...sanitizeRestProps(rest)}
        />
    );
};

DateInput.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
};

DateInput.defaultProps = {
    options: {},
};

export default DateInput;
