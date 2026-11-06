// Where Canvas previews a single component or pattern. Decorators wrap each
// previewed component, first one innermost.

import { UniformPlayground } from "@uniformdev/canvas-react";
import { resolveRenderer } from "../components";
import { BackgroundPlaygroundDecorator } from "../components/playground/BackgroundPlaygroundDecorator";
import { ResizablePlaygroundDecorator } from "../components/playground/ResizablePlaygroundDecorator";

const decorators = [BackgroundPlaygroundDecorator, ResizablePlaygroundDecorator];

export default function Playground() {
  return <UniformPlayground resolveRenderer={resolveRenderer} decorators={decorators} />;
}
