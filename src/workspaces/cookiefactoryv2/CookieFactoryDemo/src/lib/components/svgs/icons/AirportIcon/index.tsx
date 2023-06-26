// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved. 2023
// SPDX-License-Identifier: Apache-2.0
import { createClassName, type ClassName } from '@/lib/core/utils/element';

import baseStyles from '../styles.module.css';

export function AirportIcon({ className }: { className?: ClassName }) {
  return (
    <svg
      className={createClassName(baseStyles.svg, className)}
      fill="#000000"
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M13 1.9980469L13 7.9980469L8 7.9980469 A 1.0001 1.0001 0 0 0 7 8.9980469L7 12.998047 A 1.0001 1.0001 0 0 0 7.1425781 13.513672L9.2324219 16.998047L8 16.998047 A 1.0001 1.0001 0 0 0 7 17.998047L7 30.998047L4 30.998047 A 1.0001 1.0001 0 0 0 3 31.998047L3 44.998047 A 1.0001 1.0001 0 0 0 4 45.998047L45 45.998047 A 1.0001 1.0001 0 0 0 46 44.998047L46 31.998047 A 1.0001 1.0001 0 0 0 45 30.998047L21 30.998047L21 17.998047 A 1.0001 1.0001 0 0 0 20 16.998047L18.767578 16.998047L20.857422 13.513672 A 1.0001 1.0001 0 0 0 21 12.998047L21 8.9980469 A 1.0001 1.0001 0 0 0 20 7.9980469L15 7.9980469L15 1.9980469L13 1.9980469 z M 30.318359 3.7363281L37.087891 10.556641L33.582031 12.052734L29 10.769531L31.462891 14.033203L32.101562 18.074219L34.353516 13.878906L37.863281 12.382812L38.072266 21.998047L42.783203 10.283203L46.427734 8.7285156C46.930734 8.5145156 47.165172 7.9317344 46.951172 7.4277344C46.737172 6.9237344 46.157344 6.6872969 45.652344 6.9042969L42.007812 8.4589844L30.318359 3.7363281 z M 9 9.9980469L19 9.9980469L19 12.722656L16.433594 16.998047L11.566406 16.998047L9 12.722656L9 9.9980469 z M 9 18.998047L10.970703 18.998047L17 18.998047L19 18.998047L19 30.998047L9 30.998047L9 18.998047 z M 5 32.998047L8 32.998047L20 32.998047L44 32.998047L44 43.998047L40 43.998047L40 35.998047L35 35.998047L35 43.998047L5 43.998047L5 32.998047 z M 8 35.998047L8 39.998047L19 39.998047L19 35.998047L8 35.998047 z M 21 35.998047L21 39.998047L32 39.998047L32 35.998047L21 35.998047 z"></path>
      </g>
    </svg>
  );
}