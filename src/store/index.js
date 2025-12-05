'use client';

import { createContext, useContext, useState } from 'react';

const GlobalStoreContext = createContext();

export const GlobalStoreActionType = {
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    LOAD_PLAYLISTS: "LOAD_PLAYLISTS",
    UPDATE_PLAYLIST: "UPDATE_PLAYLIST",
    DELETE_PLAYLIST: "DELETE_PLAYLIST",
    SHOW_MODAL: "SHOW_MODAL",
    HIDE_MODAL: "HIDE_MODAL",
};

const storeAPI = {
    getPlaylistPairs: async () => {
        const res = await fetch("/api/store/playlistpairs", { method: "GET", credentials: "include" });
        const data = await res.json();
        return { status: res.status, data };
    },
    
    createPlaylist: async (name, ownerEmail) => {
        const res = await fetch("/api/store/playlist", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, ownerEmail, songs: [] })
        });
        const data = await res.json();
        return { status: res.status, data };
    },
    
    getPlaylistById: async (id) => {
        const res = await fetch(`/api/store/playlist/${id}`, {
            method: "GET",
            credentials: "include"
        });
        const data = await res.json();
        return { status: res.status, data };
    },
    
    updatePlaylistById: async (id, playlist) => {
        const res = await fetch(`/api/store/playlist/${id}`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ playlist })
        });
        const data = await res.json();
        return { status: res.status, data };
    },
    
    deletePlaylistById: async (id) => {
        const res = await fetch(`/api/store/playlist/${id}`, {
            method: "DELETE",
            credentials: "include"
        });
        const data = await res.json();
        return { status: res.status, data };
    }
};

export function GlobalStoreContextProvider({ children }) {
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listMarkedForDeletion: null,
        currentModal: { type: 'NONE', data: null }
    });

    const storeReducer = (action) => {
        const { type, payload } = action;
        
        switch (type) {
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS:
                return setStore({ ...store, idNamePairs: payload });
            case GlobalStoreActionType.CREATE_NEW_LIST:
                return setStore({ ...store, newListCounter: store.newListCounter + 1, idNamePairs: [...store.idNamePairs, payload] });
            case GlobalStoreActionType.SET_CURRENT_LIST:
                return setStore({ ...store, currentList: payload });
            case GlobalStoreActionType.CLOSE_CURRENT_LIST:
                return setStore({ ...store, currentList: null });
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION:
                return setStore({ ...store, listMarkedForDeletion: payload });
            case GlobalStoreActionType.DELETE_PLAYLIST:
                return setStore({ ...store, listMarkedForDeletion: null });
            case GlobalStoreActionType.SHOW_MODAL:
                return setStore({ ...store, currentModal: payload });
            case GlobalStoreActionType.HIDE_MODAL:
                return setStore({ ...store, currentModal: { type: 'NONE', data: null } });
            default:
                return store;
        }
    };

    store.loadIdNamePairs = async function () {
        const response = await storeAPI.getPlaylistPairs();
        if (response.data.success) {
            storeReducer({
                type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                payload: response.data.idNamePairs
            });
        }
    };

    store.createNewList = async function (userEmail) {
        let newListName = "Untitled" + store.newListCounter;
        const response = await storeAPI.createPlaylist(newListName, userEmail);
        if (response.data.success) {
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: response.data.playlist
            });
            store.loadIdNamePairs();
        }
    };

    store.setCurrentList = async function (id) {
        const response = await storeAPI.getPlaylistById(id);
        if (response.data.success) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_LIST,
                payload: response.data.playlist
            });
        }
    };

    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    };

    store.markListForDeletion = function (playlist) {
        storeReducer({
            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
            payload: playlist
        });
    };

    store.deleteList = async function (id) {
        const response = await storeAPI.deletePlaylistById(id);
        if (response.data.success) {
            storeReducer({
                type: GlobalStoreActionType.DELETE_PLAYLIST,
                payload: {}
            });
            store.loadIdNamePairs();
        }
    };

    store.deleteMarkedList = function () {
        store.deleteList(store.listMarkedForDeletion._id);
    };

    store.showModal = function (modalType, data) {
        storeReducer({
            type: GlobalStoreActionType.SHOW_MODAL,
            payload: { type: modalType, data }
        });
    };

    store.hideModal = function () {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODAL,
            payload: {}
        });
    };

    return (
        <GlobalStoreContext.Provider value={{ store }}>
            {children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;

export function useGlobalStore() {
    return useContext(GlobalStoreContext);
}