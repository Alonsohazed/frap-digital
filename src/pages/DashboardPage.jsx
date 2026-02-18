import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useTheme } from "../App";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Badge } from "../components/ui/badge";
import {
  Activity,
  Plus,
  Search,
  Moon,
  Sun,
  LogOut,
  MoreHorizontal,
  Eye,
  Edit,
  FileDown,
  Trash2,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { generateFRAPPDF } from "../utils/generatePDF";

export default function DashboardPage() {
  const [fraps, setFraps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, logout, getAuthHeaders, API } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const fetchFraps = async () => {
    try {
      const url = searchTerm ? `${API}/fraps?search=${encodeURIComponent(searchTerm)}` : `${API}/fraps`;
      const response = await fetch(url, { headers: getAuthHeaders() });
      if (response.ok) {
        const data = await response.json();
        setFraps(data);
      }
    } catch (error) {
      console.error("Error fetching FRAPs:", error);
      toast.error("Error al cargar los registros");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFraps();
  }, [searchTerm]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este FRAP?")) return;
    
    try {
      const response = await fetch(`${API}/fraps/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        toast.success("FRAP eliminado correctamente");
        fetchFraps();
      } else {
        const error = await response.json();
        toast.error(error.detail || "Error al eliminar");
      }
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  const handleDownloadPDF = async (id, folio) => {
    try {
      toast.info("Generando PDF...");
      const response = await fetch(`${API}/fraps/${id}`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const frapData = await response.json();
        await generateFRAPPDF(frapData);
        toast.success("PDF generado correctamente");
      } else {
        toast.error("Error al obtener datos del FRAP");
      }
    } catch (error) {
      console.error("Error generando PDF:", error);
      toast.error("Error al generar el PDF");
    }
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      rojo: "bg-red-500 text-white hover:bg-red-600",
      amarillo: "bg-yellow-500 text-black hover:bg-yellow-600",
      verde: "bg-green-500 text-white hover:bg-green-600",
      negro: "bg-black text-white hover:bg-gray-800"
    };
    const labels = {
      rojo: "ROJO",
      amarillo: "AMARILLO",
      verde: "VERDE",
      negro: "NEGRO"
    };
    return (
      <Badge className={styles[priority] || "bg-gray-500"}>
        {labels[priority] || priority || "-"}
      </Badge>
    );
  };

  const getConditionBadge = (condition) => {
    const styles = {
      critico_inestable: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      critico_estable: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      no_critico: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    };
    const labels = {
      critico_inestable: "Crítico Inestable",
      critico_estable: "Crítico Estable",
      no_critico: "No Crítico"
    };
    return (
      <Badge variant="outline" className={styles[condition]}>
        {labels[condition] || condition || "-"}
      </Badge>
    );
  };

  const totalFraps = fraps.length;
  const criticosInestables = fraps.filter(f => f.condicion_paciente === 'critico_inestable').length;
  const hoy = new Date().toISOString().split('T')[0];
  const frapsHoy = fraps.filter(f => f.fecha === hoy).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">FRAP Digital</h1>
              <p className="text-xs text-muted-foreground">Rescate Ensenada</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="dark-mode-toggle"
              data-testid="theme-toggle-btn"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2" data-testid="user-menu-btn">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">{user?.nombre}</span>
                  {user?.role === "admin" && (
                    <Badge variant="secondary" className="ml-1">Admin</Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={logout} data-testid="logout-btn">
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total FRAPs
              </CardTitle>
              <FileText className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalFraps}</div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Críticos Hoy
              </CardTitle>
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">{criticosInestables}</div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                FRAPs Hoy
              </CardTitle>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{frapsHoy}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o folio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11"
              data-testid="search-input"
            />
          </div>
          <Button
            onClick={() => navigate("/frap/nuevo")}
            className="h-11 bg-blue-600 hover:bg-blue-700"
            data-testid="new-frap-btn"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo FRAP
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="spinner" />
              </div>
            ) : fraps.length === 0 ? (
              <div className="empty-state py-12">
                <FileText className="empty-state-icon w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No hay registros</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "No se encontraron resultados" : "Crea tu primer FRAP"}
                </p>
                {!searchTerm && (
                  <Button onClick={() => navigate("/frap/nuevo")} data-testid="empty-new-frap-btn">
                    <Plus className="w-4 h-4 mr-2" />
                    Crear FRAP
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Folio</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Condición</TableHead>
                      <TableHead>Prioridad</TableHead>
                      <TableHead>Creado por</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fraps.map((frap) => (
                      <TableRow key={frap.id} className="data-table-row" data-testid={`frap-row-${frap.id}`}>
                        <TableCell className="font-mono font-medium">
                          {frap.folio || "-"}
                        </TableCell>
                        <TableCell>{frap.fecha || "-"}</TableCell>
                        <TableCell className="font-medium">
                          {frap.nombre_paciente || "Sin nombre"}
                        </TableCell>
                        <TableCell>
                          {getConditionBadge(frap.condicion_paciente)}
                        </TableCell>
                        <TableCell>
                          {getPriorityBadge(frap.prioridad)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {frap.created_by_name}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" data-testid={`frap-actions-${frap.id}`}>
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/frap/${frap.id}`)}>
                                <Eye className="w-4 h-4 mr-2" />
                                Ver Detalle
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/frap/${frap.id}/editar`)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownloadPDF(frap.id, frap.folio)}>
                                <FileDown className="w-4 h-4 mr-2" />
                                Descargar PDF
                              </DropdownMenuItem>
                              {user?.role === "admin" && (
                                <DropdownMenuItem
                                  onClick={() => handleDelete(frap.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Eliminar
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
