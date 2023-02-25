# isomorphic-image-hash

A dhash library that works in both browsers and Node.js.

## Usage

```js
import { dhash, distance } from 'isomorphic-image-hash'

// Get the image hash value.
const hash = await dhash('path/to/images/mandrill.jpg')

console.log(hash) // '0001111110101011111010100110100001101000001110000101001001101000'

// Get the Hamming distance of hash values.
distance(hash, otherHash)
```
