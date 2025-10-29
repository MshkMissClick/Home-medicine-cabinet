import { AuthProvider } from './contexts/AuthContext';
import { MedicineProvider } from './contexts/MedicineContext';
import { Header } from './components/layout/Header';
import { MedicineList } from './components/medicine/MedicineList';
import './styles/globals.css';

function App() {
    return (
        <AuthProvider>
            <MedicineProvider>
                <div className="min-h-screen bg-gray-50">
                    <Header />
                    <main>
                        <MedicineList />
                    </main>
                </div>
            </MedicineProvider>
        </AuthProvider>
    );
}

export default App;