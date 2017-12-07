import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';

/**
 * @example
 * <FunctionField source="last_name" label="Name" render={record => `${record.first_name} ${record.last_name}`} />
 */
const FunctionField = ({ className, record = {}, source, render }) =>
    record ? <span className={className}>{render(record, source)}</span> : null;

FunctionField.propTypes = {
    addLabel: PropTypes.bool,
    className: PropTypes.string,
    label: PropTypes.string,
    render: PropTypes.func.isRequired,
    record: PropTypes.object,
    source: PropTypes.string,
};

const PureFunctionField = pure(FunctionField);

PureFunctionField.defaultProps = {
    addLabel: true,
};

export default PureFunctionField;
