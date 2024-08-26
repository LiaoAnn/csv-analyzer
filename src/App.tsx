import CSVAnalyzer from "./components/csv-analyzer";
import StoreProvider from "./components/providers/store-provider";

function App() {
  return (
    <StoreProvider>
      <div className="bg-slate-50 min-h-[100vh] max-h-[100vh] flex flex-col">
        <CSVAnalyzer />
      </div>
    </StoreProvider>
  );
}

export default App;
