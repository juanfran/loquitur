import Fuse from 'fuse.js';

const options = {
  keys: ['text'],
  minMatchCharLength: 2,
  threshold: 0.4,
};

export const fuse = new Fuse([], options);
