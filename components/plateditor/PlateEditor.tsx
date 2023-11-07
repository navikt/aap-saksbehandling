'use client';
import { Plate, PlateContent } from '@udecode/plate-core';

export const PlateEditor = () => {
  return (
    <div>
      <h1>Plate Editor</h1>
      <Plate>
        <PlateContent placeholder="Type..." />
      </Plate>
    </div>
  );
};
