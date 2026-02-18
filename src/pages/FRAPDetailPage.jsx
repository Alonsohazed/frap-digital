import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth, useTheme } from "../App";

import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  Activity,
  ArrowLeft,
  Edit,
  FileDown,
  Moon,
  Sun,
  User,
  MapPin,
  Phone,
  Clock,
  Heart,
  Stethoscope,
  ClipboardList,
} from "lucide-react";

export default function FRAPDetailPage() {
  const { id } = useParams();
  const [frap, setFrap] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, getAuthHeaders, API } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFrap();
  }, [id]);

  const fetchFrap = async () => {
    try {
      const response = await fetch(`${API}/fraps/${id}`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setFrap(data);
      } else {
        toast.error("Error al cargar el FRAP");
        navigate("/");
      }
    } catch (error) {
      toast.error("Error al cargar el FRAP");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    toast.info("La generación de PDF estará disponible próximamente");
      link.href = url;
      link.setAttribute('download', `FRAP_${frap?.folio || id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
  const handleDownloadPDF = async () => {
    toast.info("La generación de PDF estará disponible próximamente");
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      rojo: "bg-red-500 text-white",
      amarillo: "bg-yellow-500 text-black",
      verde: "bg-green-500 text-white",
      negro: "bg-black text-white"
    };
    const labels = {
      rojo: "ROJO",
      amarillo: "AMARILLO",
      verde: "VERDE",
      negro: "NEGRO"
    };
    return priority ? (
      <Badge className={styles[priority]}>
        {labels[priority]}
      </Badge>
    ) : null;
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
    return condition ? (
      <Badge variant="outline" className={styles[condition]}>
        {labels[condition]}
      </Badge>
    ) : null;
  };

  const InfoRow = ({ label, value }) => (
    value ? (
      <div className="flex justify-between py-1">
        <span className="text-muted-foreground">{label}:</span>
        <span className="font-medium">{value}</span>
      </div>
    ) : null
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="spinner" />
      </div>
    );
  }

  if (!frap) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} data-testid="back-btn">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">FRAP #{frap.folio || "Sin Folio"}</h1>
              <p className="text-xs text-muted-foreground">{frap.fecha}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="dark-mode-toggle"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/frap/${id}/editar`)}
              data-testid="edit-frap-btn"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button
              onClick={handleDownloadPDF}
              className="bg-blue-600 hover:bg-blue-700"
              data-testid="download-pdf-btn"
            >
              <FileDown className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Patient Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" />
                    Datos del Paciente
                  </CardTitle>
                  <div className="flex gap-2">
                    {getConditionBadge(frap.condicion_paciente)}
                    {getPriorityBadge(frap.prioridad)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  <InfoRow label="Nombre" value={frap.nombre_paciente} />
                  <InfoRow label="Sexo" value={frap.sexo === 'masculino' ? 'Masculino' : frap.sexo === 'femenino' ? 'Femenino' : ''} />
                  <InfoRow label="Edad" value={frap.edad_anos ? `${frap.edad_anos} años ${frap.edad_meses ? `${frap.edad_meses} meses` : ''}` : ''} />
                  <InfoRow label="Ocupación" value={frap.ocupacion} />
                  <InfoRow label="Teléfono" value={frap.telefono} />
                  <InfoRow label="Acompañante" value={frap.nombre_acompanante} />
                  <div className="md:col-span-2">
                    <InfoRow label="Domicilio" value={frap.domicilio} />
                  </div>
                  <InfoRow label="Colonia" value={frap.colonia_paciente} />
                  <InfoRow label="Delegación" value={frap.delegacion_paciente} />
                  <InfoRow label="Derechohabiente" value={frap.derechohabiente} />
                  <InfoRow label="Compañía de Seguros" value={frap.compania_seguros} />
                </div>
              </CardContent>
            </Card>

            {/* Service Location */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-500" />
                  Ubicación del Servicio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  <InfoRow label="Calle" value={frap.ubicacion_calle} />
                  <InfoRow label="Entre" value={frap.ubicacion_entre} />
                  <InfoRow label="Colonia" value={frap.ubicacion_colonia} />
                  <InfoRow label="Delegación" value={frap.ubicacion_delegacion} />
                  <InfoRow label="Lugar de Ocurrencia" value={frap.lugar_ocurrencia?.replace(/_/g, ' ')} />
                </div>
              </CardContent>
            </Card>

            {/* Vitals */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Signos Vitales y Evaluación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2 mb-4">
                  <InfoRow label="Nivel Conciencia" value={frap.nivel_conciencia?.replace(/_/g, ' ')} />
                  <InfoRow label="Vía Aérea" value={frap.via_aerea} />
                  <InfoRow label="Ventilación" value={frap.ventilacion?.replace(/_/g, ' ')} />
                  <InfoRow label="Auscultación" value={frap.auscultacion} />
                  <InfoRow label="Pulsos" value={frap.presencia_pulsos} />
                  <InfoRow label="Calidad Pulso" value={frap.calidad_pulso} />
                  <InfoRow label="Piel" value={frap.piel} />
                </div>
                
                {frap.vitales && frap.vitales.length > 0 && frap.vitales.some(v => v.hora) && (
                  <>
                    <Separator className="my-4" />
                    <h4 className="font-medium mb-3">Registro de Vitales</h4>
                    <div className="overflow-x-auto">
                      <table className="vitals-table text-sm">
                        <thead>
                          <tr>
                            <th>Hora</th>
                            <th>FR</th>
                            <th>FC</th>
                            <th>TAS</th>
                            <th>TAD</th>
                            <th>SaO2</th>
                            <th>Temp</th>
                            <th>Gluc</th>
                          </tr>
                        </thead>
                        <tbody>
                          {frap.vitales.filter(v => v.hora).map((vital, i) => (
                            <tr key={i}>
                              <td>{vital.hora}</td>
                              <td>{vital.fr}</td>
                              <td>{vital.fc}</td>
                              <td>{vital.tas}</td>
                              <td>{vital.tad}</td>
                              <td>{vital.sao2}</td>
                              <td>{vital.temp}</td>
                              <td>{vital.gluc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Scales */}
            {(frap.glasgow_total || frap.asimetria_facial) && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-purple-500" />
                    Escalas de Evaluación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {frap.glasgow_total && (
                      <div>
                        <h4 className="font-medium mb-2">Glasgow</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <InfoRow label="Ocular" value={frap.glasgow_ocular} />
                          <InfoRow label="Verbal" value={frap.glasgow_verbal} />
                          <InfoRow label="Motor" value={frap.glasgow_motor} />
                          <InfoRow label="Total" value={frap.glasgow_total} />
                        </div>
                      </div>
                    )}
                    {(frap.asimetria_facial || frap.paresia_brazos || frap.alteracion_lenguaje) && (
                      <div>
                        <h4 className="font-medium mb-2">Cincinnati</h4>
                        <div className="text-sm space-y-1">
                          <InfoRow label="Asimetría Facial" value={frap.asimetria_facial === 'si' ? 'Sí' : frap.asimetria_facial === 'no' ? 'No' : ''} />
                          <InfoRow label="Paresia Brazos" value={frap.paresia_brazos === 'si' ? 'Sí' : frap.paresia_brazos === 'no' ? 'No' : ''} />
                          <InfoRow label="Alt. Lenguaje" value={frap.alteracion_lenguaje === 'si' ? 'Sí' : frap.alteracion_lenguaje === 'no' ? 'No' : ''} />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Observations */}
            {frap.observaciones && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Observaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{frap.observaciones}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Times & Meta */}
          <div className="space-y-6">
            {/* Times */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  Tiempos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoRow label="Hora Llamada" value={frap.hora_llamada} />
                <InfoRow label="Hora Salida" value={frap.hora_salida} />
                <InfoRow label="Hora Llegada" value={frap.hora_llegada_traslado} />
                <InfoRow label="Hora Hospital" value={frap.hora_llegada_hospital} />
                <InfoRow label="Hora Base" value={frap.hora_llegada_base} />
              </CardContent>
            </Card>

            {/* Service Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Información del Servicio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoRow label="Motivo" value={frap.motivo_atencion?.replace(/_/g, ' ')} />
                <InfoRow label="Operador" value={frap.operador} />
                <InfoRow label="Prestadores" value={frap.prestadores_servicio} />
                <Separator className="my-3" />
                <InfoRow label="Creado por" value={frap.created_by_name} />
                <InfoRow label="Fecha Creación" value={new Date(frap.created_at).toLocaleString('es-MX')} />
              </CardContent>
            </Card>

            {/* Origin */}
            {frap.origen_probable && frap.origen_probable.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Origen Probable</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {frap.origen_probable.map((origen) => (
                      <Badge key={origen} variant="secondary" className="capitalize">
                        {origen.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Consent Status */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Estado Legal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Consentimiento Informado</span>
                  <Badge variant={frap.consentimiento_informado ? "default" : "outline"} className={frap.consentimiento_informado ? "bg-green-500" : ""}>
                    {frap.consentimiento_informado ? "Firmado" : "Pendiente"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Negativa de Atención</span>
                  <Badge variant={frap.negativa_atencion ? "destructive" : "outline"}>
                    {frap.negativa_atencion ? "Firmada" : "No Aplica"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Signatures Preview */}
            {frap.firmas && Object.values(frap.firmas).some(v => v) && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Firmas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {frap.firmas.paciente && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Paciente</p>
                      <img src={frap.firmas.paciente} alt="Firma Paciente" className="h-12 border rounded" />
                    </div>
                  )}
                  {frap.firmas.testigo && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Testigo</p>
                      <img src={frap.firmas.testigo} alt="Firma Testigo" className="h-12 border rounded" />
                    </div>
                  )}
                  {frap.firmas.familiar_tutor && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Familiar/Tutor</p>
                      <img src={frap.firmas.familiar_tutor} alt="Firma Familiar" className="h-12 border rounded" />
                    </div>
                  )}
                  {frap.firmas.medico_recibe && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Médico que Recibe</p>
                      <img src={frap.firmas.medico_recibe} alt="Firma Médico" className="h-12 border rounded" />
                    </div>
                  )}
                  {frap.firmas.entrega_paciente && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Entrega Paciente</p>
                      <img src={frap.firmas.entrega_paciente} alt="Firma Entrega" className="h-12 border rounded" />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
