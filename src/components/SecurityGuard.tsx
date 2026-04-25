import React, { useEffect, useState } from 'react';
import { DraggableWrapper } from "./shared/DraggableWrapper";

export default function SecurityGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
