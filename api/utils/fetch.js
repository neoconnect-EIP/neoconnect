'use strict';

const fetch = require('node-fetch');

module.exports = {
    postFetch : async function (url, body, token) {
        let res = await fetch(url, {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
            .then(res => res)
            .then(res => res);
        return ({status: res.status, body: await res.json()});
    },
    getFetch : async function (url, token) {
        let res = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
            .then(res => res)
            .then(res => res);
        return ({status: res.status, body: await res.json()});
    },
    putFetch : async function (url, body, token) {
        let res = await fetch(url, {
            method: 'put',
            body: JSON.stringify(body),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
            .then(res => res)
            .then(res => res);
        return ({status: res.status, body: await res.json()});
    },
    deleteFetch : async function (url, body, token) {
        let res = await fetch(url, {
            method: 'delete',
            body: JSON.stringify(body),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
            .then(res => res)
            .then(res => res);
        return ({status: res.status, body: await res.json()});
    }
};
