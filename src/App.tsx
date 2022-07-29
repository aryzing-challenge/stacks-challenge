import { Home } from "./components/Home";
import { Providers } from "./providers";

export const App = () => {
  return (
    <Providers>
      <Home />
    </Providers>
  );
};
