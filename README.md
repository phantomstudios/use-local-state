# use-local-state

[![NPM version][npm-image]][npm-url]
[![Actions Status][ci-image]][ci-url]
[![PR Welcome][npm-downloads-image]][npm-downloads-url]

A simple React hook that allows you to store data within `LocalStorage` with the same interface as the standard `React.useState` hook.

## Introduction

Just swap out your `useState` calls with `useLocalState` to persist the data between refreshes. This hook is also SSR safe and does not break when used without `window` existing.

```javascript
import useLocalState from "@phntms/use-local-state";

const [value, setValue, resetValue] = useLocalState("KEY", "");
```

## Installation

Install this package with `npm`.

```bash
npm i @phntms/use-local-state
```

## Usage

Store a boolean to track if a user has accepted terms of use.

```JSX
import React from 'react';
import useLocalState from '@phntms/use-local-state';

const TermsExample = () = {
  const [accepted, setAccepted] = useLocalState("TERMS_ACCEPTED", false);

  return (
    <>
      <h1>Welcome</h2>
      {!accepted && <>
        <p>Do you accept our terms?</p>
        <button onClick={()=>setAccepted(true)}>Accept</button>
      </>}
    </>
  );
}
```

Store a list of bookmarks.

```JSX
import React from 'react';
import useLocalState from '@phntms/use-local-state';

interface Bookmark {
  title: string;
  url: string;
}

const BookmarkExample = () = {
  const [bookmarks, setBookmarks, clearBookmarks] = useLocalState<Bookmark[]>("BOOKMARKS", []);

  const addBookmark = (bookmark: Bookmark) => setBookmarks([...bookmarks, bookmark]);

  return (
    <>
      <h1>Bookmarks</h2>
      <NewBookmark add={addBookmark} />
      <button onClick={clearBookmarks}>Clear Bookmarks</button>
      <ul>
        {bookmarks.map(((bookmark, i) => (
          <li key={i}>
            <a href={bookmark.url}>{bookmark.title}</a>
          </li>
        )))}
      </ul>
    </>
  );
}
```

## API

### Input

- `key` : Required - The key of type `string` to store within `LocalStorage`.
- `initialValue` : Required - The default/initial value of type `T` if the key is not found within the `LocalStorage` object.

### Output

An array containing the value, a function to set the value and another function to reset the value.

- `[0]` : The value of the data stored in LocalStorage or the defaultValue if not set.
- `[1]` : A function to set the value stored in LocalStorage. Signature is exactly like the standard [React.useState](https://reactjs.org/docs/hooks-state.html) hook.
- `[2]` : A function to reset the data stored in the LocalStorage.

[npm-image]: https://img.shields.io/npm/v/@phntms/use-local-state.svg?style=flat-square&logo=react
[npm-url]: https://npmjs.org/package/@phntms/use-local-state
[npm-downloads-image]: https://img.shields.io/npm/dm/@phntms/use-local-state.svg
[npm-downloads-url]: https://npmcharts.com/compare/@phntms/use-local-state?minimal=true
[ci-image]: https://github.com/phantomstudios/use-local-state/workflows/test/badge.svg
[ci-url]: https://github.com/phantomstudios/use-local-state/actions
