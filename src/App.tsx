import { BrowserRouter, Route, Routes } from "react-router-dom";
import StoriesList from "./pages/StoriesList";
import Story from "./pages/Story";

const App = () => {
  return (
    <BrowserRouter>
      <main className="mx-auto min-h-svh max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<StoriesList />} />
          <Route path="/story/:id" element={<Story />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
