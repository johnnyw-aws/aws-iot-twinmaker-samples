// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved. 2023
// SPDX-License-Identifier: Apache-2.0

import { AWSLogo, CookieFactoryLogoWide } from '@/lib/components/svgs/logos';
import { createClassName, type ClassName } from '@/lib/core/utils/element';

import styles from './styles.module.css';
//Todo
export function Logo({ className }: { className?: ClassName }) {
  return <AWSLogo className={createClassName(styles.root, className)} />;
}
