import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Search from "./pages/Search.tsx";
import WordDetail from "./pages/WordDetail.tsx";
import Categories from "./pages/Categories.tsx";
import Pronunciation from "./pages/Pronunciation.tsx";
import About from "./pages/About.tsx";
import Submit from "./pages/Submit.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<Search />} />
          <Route path="/word/:id" element={<WordDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/pronunciation" element={<Pronunciation />} />
          <Route path="/about" element={<About />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
