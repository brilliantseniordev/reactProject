import * as React from 'react';
import { useState } from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { TestContext } from 'ra-test';

import undoableEventEmitter from './undoableEventEmitter';
import DataProviderContext from './DataProviderContext';
import { useUpdate } from './useUpdate';
import { useGetOne } from './useGetOne';

export default { title: 'ra-core/dataProvider/useUpdate/undoable' };

export const SuccessCase = () => {
    const posts = [{ id: 1, title: 'Hello', author: 'John Doe' }];
    const dataProvider = {
        getOne: (resource, params) => {
            console.log('getOne', resource, params);
            return Promise.resolve({
                data: posts.find(p => p.id === params.id),
            });
        },
        update: (resource, params) => {
            console.log('update', resource, params);
            return new Promise(resolve => {
                setTimeout(() => {
                    const post = posts.find(p => p.id === params.id);
                    post.title = params.data.title;
                    resolve({ data: post });
                }, 1000);
            });
        },
    } as any;
    return (
        <TestContext enableReducers>
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <SuccessCore />
                </DataProviderContext.Provider>
            </QueryClientProvider>
        </TestContext>
    );
};

const SuccessCore = () => {
    const [notification, setNotification] = useState<boolean>(false);
    const [success, setSuccess] = useState<string>();
    const { data, refetch } = useGetOne('posts', 1);
    const mutation = useUpdate(undefined, {
        mutationMode: 'undoable',
    });
    const handleClick = () => {
        mutation.mutate(
            {
                resource: 'posts',
                id: 1,
                data: { title: 'Hello World' },
            },
            {
                onSuccess: () => setSuccess('success'),
            }
        );
        setNotification(true);
    };
    return (
        <>
            <dl>
                <dt>title</dt>
                <dd>{data?.title}</dd>
                <dt>author</dt>
                <dd>{data?.author}</dd>
            </dl>
            <div>
                {notification ? (
                    <>
                        <button
                            onClick={() => {
                                undoableEventEmitter.emit('end', {
                                    isUndo: false,
                                });
                                setNotification(false);
                            }}
                        >
                            Confirm
                        </button>
                        &nbsp;
                        <button
                            onClick={() => {
                                undoableEventEmitter.emit('end', {
                                    isUndo: true,
                                });
                                setNotification(false);
                            }}
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button onClick={handleClick} disabled={mutation.isLoading}>
                        Update title
                    </button>
                )}
                &nbsp;
                <button onClick={() => refetch()}>Refetch</button>
            </div>

            {success && <div>{success}</div>}
        </>
    );
};

export const ErrorCase = () => {
    const posts = [{ id: 1, title: 'Hello', author: 'John Doe' }];
    const dataProvider = {
        getOne: (resource, params) => {
            console.log('getOne', resource, params);
            return Promise.resolve({
                data: posts.find(p => p.id === params.id),
            });
        },
        update: (resource, params) => {
            console.log('update', resource, params);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(new Error('something went wrong'));
                }, 1000);
            });
        },
    } as any;
    return (
        <TestContext enableReducers>
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider value={dataProvider}>
                    <ErrorCore />
                </DataProviderContext.Provider>
            </QueryClientProvider>
        </TestContext>
    );
};

const ErrorCore = () => {
    const [notification, setNotification] = useState<boolean>(false);
    const [success, setSuccess] = useState<string>();
    const [error, setError] = useState<any>();
    const { data, refetch } = useGetOne('posts', 1);
    const mutation = useUpdate(undefined, {
        mutationMode: 'undoable',
    });
    const handleClick = () => {
        mutation.mutate(
            {
                resource: 'posts',
                id: 1,
                data: { title: 'Hello World' },
            },
            {
                onSuccess: () => setSuccess('success'),
                onError: e => {
                    setError(e);
                    setSuccess('');
                },
            }
        );
        setNotification(true);
    };
    return (
        <>
            <dl>
                <dt>title</dt>
                <dd>{data?.title}</dd>
                <dt>author</dt>
                <dd>{data?.author}</dd>
            </dl>
            <div>
                {notification ? (
                    <>
                        <button
                            onClick={() => {
                                undoableEventEmitter.emit('end', {
                                    isUndo: false,
                                });
                                setNotification(false);
                            }}
                        >
                            Confirm
                        </button>
                        &nbsp;
                        <button
                            onClick={() => {
                                undoableEventEmitter.emit('end', {
                                    isUndo: true,
                                });
                                setNotification(false);
                            }}
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button onClick={handleClick} disabled={mutation.isLoading}>
                        Update title
                    </button>
                )}
                &nbsp;
                <button onClick={() => refetch()}>Refetch</button>
            </div>
            {success && <div>{success}</div>}
            {error && <div>{error.message}</div>}
        </>
    );
};
