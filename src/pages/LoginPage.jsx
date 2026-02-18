import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../App";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Activity, Eye, EyeOff, Shield } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  if (user) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await login(username, password);
    
    if (success) {
      navigate(from, { replace: true });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-slate-700 bg-slate-900/90 backdrop-blur-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center shadow-lg overflow-hidden bg-white">
            <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain" />
          </div>
          
          <div>
            <CardTitle className="text-2xl font-bold text-white">
              FRAP Digital
            </CardTitle>
            <CardDescription className="text-slate-400 mt-2">
              Cuerpo de Rescate de Ensenada, A.C.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-300">
                Usuario
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                className="h-12 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                required
                data-testid="login-username-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className="h-12 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 pr-12"
                  required
                  data-testid="login-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base"
              disabled={loading}
              data-testid="login-submit-btn"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="spinner" />
                  <span>Ingresando...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span>Iniciar Sesión</span>
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 text-center">
              Usuarios de prueba:
            </p>
            <div className="mt-2 space-y-1 text-xs text-slate-500">
              <p><span className="text-slate-400">Admin:</span> admin / admin123</p>
              <p><span className="text-slate-400">Operador 1:</span> operador1 / rescate1</p>
              <p><span className="text-slate-400">Operador 2:</span> operador2 / rescate2</p>
              <p><span className="text-slate-400">Operador 3:</span> operador3 / rescate3</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="absolute bottom-4 text-center text-slate-500 text-xs">
        <p>Calle Magnolias No. 2356, Col. Márquez de León</p>
        <p>Ensenada, Baja California, México</p>
      </div>
    </div>
  );
}
