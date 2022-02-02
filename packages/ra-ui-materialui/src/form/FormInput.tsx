import * as React from 'react';
import { styled } from '@mui/material/styles';
import { HtmlHTMLAttributes, ReactElement } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { RaRecord } from 'ra-core';

import { Labeled } from '../input/Labeled';

export const FormInput = <
    RecordType extends RaRecord | Omit<RaRecord, 'id'> = any
>(
    props: FormInputProps<RecordType>
) => {
    const { input, ...rest } = props;

    const { id, className, ...inputProps } = input
        ? input.props
        : { id: undefined, className: undefined };
    return input ? (
        <Root
            className={classnames(
                'ra-input',
                `ra-input-${input.props.source}`,
                input.props.formClassName,
                className
            )}
        >
            {input.props.addLabel ? (
                <Labeled
                    id={id || input.props.source}
                    {...inputProps}
                    {...sanitizeRestProps(rest)}
                >
                    {React.cloneElement(input, {
                        className: classnames({
                            [FormInputClasses.input]: !input.props.fullWidth,
                        }),
                        id: input.props.id || input.props.source,
                        ...rest,
                        ...inputProps,
                    })}
                </Labeled>
            ) : (
                React.cloneElement(input, {
                    className: classnames({
                        [FormInputClasses.input]: !input.props.fullWidth,
                    }),
                    id: input.props.id || input.props.source,
                    ...rest,
                    ...inputProps,
                })
            )}
        </Root>
    ) : null;
};

FormInput.propTypes = {
    // @ts-ignore
    input: PropTypes.node,
};

export interface FormInputProps<
    RecordType extends RaRecord | Omit<RaRecord, 'id'> = any
> extends HtmlHTMLAttributes<HTMLDivElement> {
    input: ReactElement<{
        label?: string;
        source?: string;
        id?: string;
        [key: string]: unknown;
    }>;
    margin?: 'none' | 'normal' | 'dense';
    record?: RecordType;
    resource?: string;
    variant?: 'standard' | 'outlined' | 'filled';
}

// What? TypeScript loses the displayName if we don't set it explicitly
FormInput.displayName = 'FormInput';

const PREFIX = 'RaFormInput';

export const FormInputClasses = {
    input: `${PREFIX}-input`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${FormInputClasses.input}`]: { width: theme.spacing(32) },
}));

const sanitizeRestProps = ({ record, ...rest }: { record?: unknown }) => rest;
