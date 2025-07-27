// components/TypeaheadInstrument.jsx

import React, { useState, useEffect, useMemo, forwardRef } from 'react';
import {
    Autocomplete,
    TextField,
    CircularProgress,
    ListSubheader,
} from '@mui/material';
import { FixedSizeList } from 'react-window';
import debounce from 'lodash.debounce';
import axiosInstance from '../utils/axios';

const LISTBOX_PADDING = 8;

const renderRow = (props) => {
    const { data, index, style } = props;
    return React.cloneElement(data[index], {
        style: {
            ...style,
            top: style.top + LISTBOX_PADDING,
        },
    });
};

const ListboxComponent = forwardRef(function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const itemData = React.Children.toArray(children);
    const itemCount = itemData.length;
    const itemSize = 48;

    return (
        <div ref={ref} {...other}>
            <ListSubheader>Instruments</ListSubheader>
            <FixedSizeList
                height={Math.min(8, itemCount) * itemSize + 2 * LISTBOX_PADDING}
                itemData={itemData}
                itemCount={itemCount}
                itemSize={itemSize}
                overscanCount={5}
                width="100%"
            >
                {renderRow}
            </FixedSizeList>
        </div>
    );
});

const TypeaheadInstrument = ({ label, onSelect, error, helperText, account }) => {
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchInstruments = async (query) => {
        try {
            if (!query || query.length < 2) return;
            setLoading(true);

            const res = await axiosInstance.post('data/instruments-list', {
                query,
                access_token: account?.access_token,
                api_key: account?.accountKey,
            });

            if (res.data.success) {
                setOptions(res.data.data || []);
            } else {
                setOptions([]);
            }
        } catch (e) {
            console.error('Instrument fetch failed', e);
            setOptions([]);
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetch = useMemo(() => debounce(fetchInstruments, 500), [account]);

    useEffect(() => {
        if (inputValue.length >= 2) {
            debouncedFetch(inputValue);
        }
    }, [inputValue, debouncedFetch]);

    return (
        <Autocomplete
            freeSolo
            disableListWrap
            disableClearable
            loading={loading}
            options={options}
            getOptionLabel={(option) =>
                typeof option === 'string'
                    ? option
                    : `${option.tradingsymbol} (${option.name})`
            }
            onInputChange={(e, newVal) => setInputValue(newVal)}
            onChange={(e, val) => onSelect(val)}
            ListboxComponent={ListboxComponent}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label || 'Select Instrument'}
                    error={!!error}
                    helperText={helperText}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? (
                                    <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
};

export default TypeaheadInstrument;
