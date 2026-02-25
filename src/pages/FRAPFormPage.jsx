import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth, useTheme } from "../App";

import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { SignaturePad } from "../components/SignaturePad";
import { BodyDiagram } from "../components/BodyDiagram";
import {
  Activity,
  ArrowLeft,
  Save,
  Moon,
  Sun,
  User,
  Heart,
  Stethoscope,
  ClipboardList,
  PenTool,
  Baby,
  AlertTriangle,
} from "lucide-react";

const INITIAL_FORM_STATE = {
  // Identification
  fecha: new Date().toISOString().split('T')[0],
  folio: "",
  hora_llamada: "",
  hora_salida: "",
  hora_llegada_traslado: "",
  hora_traslado: "",
  hora_llegada_hospital: "",
  hora_llegada_base: "",
  
  // Motivo atencion
  motivo_atencion: "",
  
  // Nivel conciencia
  nivel_conciencia: "",
  via_aerea: "",
  reflejo_deglucion: "",
  
  // Ventilacion
  ventilacion: "",
  auscultacion: "",
  neumotorax: "",
  sitio_neumotorax: "",
  
  // Circulacion
  presencia_pulsos: "",
  calidad_pulso: "",
  piel: "",
  caracteristicas_piel: "",
  
  // Ubicacion servicio
  ubicacion_calle: "",
  ubicacion_entre: "",
  ubicacion_colonia: "",
  ubicacion_delegacion: "",
  lugar_ocurrencia: "",
  lugar_ocurrencia_otro: "",
  numero_ambulancia: "",
  
  // Operador y prestadores
  operador: "",
  prestadores_servicio: "",
  
  // Paciente info
  nombre_paciente: "",
  nombre_acompanante: "",
  sexo: "",
  edad_anos: "",
  edad_meses: "",
  domicilio: "",
  colonia_paciente: "",
  delegacion_paciente: "",
  telefono: "",
  derechohabiente: "",
  compania_seguros: "",
  ocupacion: "",
  
  // Origen probable
  origen_probable: [],
  origen_probable_otro: "",
  primera_vez: false,
  subsecuente: false,
  
  // Exploracion fisica
  exploracion_fisica: [],
  zonas_lesion: {},
  pupilas_derecha: "",
  pupilas_izquierda: "",
  
  // Vitales
  vitales: [
    { hora: "", fr: "", fc: "", tas: "", tad: "", sao2: "", temp: "", gluc: "" },
    { hora: "", fr: "", fc: "", tas: "", tad: "", sao2: "", temp: "", gluc: "" },
    { hora: "", fr: "", fc: "", tas: "", tad: "", sao2: "", temp: "", gluc: "" },
  ],
  
  // Condicion y prioridad
  condicion_paciente: "",
  prioridad: "",
  
  // Via aerea manejo
  via_aerea_manejo: [],
  control_cervical: "",
  asistencia_ventilatoria: "",
  
  // Ventilacion/Oxigenoterapia
  ventilador_automatico: false,
  ventilador_frec: "",
  ventilador_vol: "",
  oxigenoterapia: "",
  lts_x_min: "",
  
  // Control hemorragias
  control_hemorragias: [],
  
  // Vias venosas
  via_iv_num: "",
  cateter_num: "",
  sitio_aplicacion: "",
  tipo_soluciones: [],
  tipo_soluciones_otra: "",
  
  // Accidente automovilistico
  accidente_colision: "",
  accidente_contra_objeto: "",
  accidente_hundimiento: "",
  accidente_impacto: "",
  volante: "",
  bolsa_aire: "",
  cinturon_seguridad: "",
  dentro_vehiculo: "",
  casco_seguridad: "",
  eyectado: "",
  parabrisas_roto: false,
  parabrisas_doblado: false,
  
  // Atropellado
  atropellado: "",
  
  // Lesiones
  lesiones_causadas_por: "",
  
  // Agente causal
  agente_causal: [],
  agente_causal_otro: "",
  
  // Interrogatorio (SAMPLE)
  alergias: "",
  medicamentos: "",
  enfermedades_previas: "",
  ultima_comida: "",
  eventos_previos: "",
  
  // Observaciones
  observaciones: "",
  
  // Escala Glasgow
  glasgow_ocular: "",
  glasgow_verbal: "",
  glasgow_motor: "",
  glasgow_total: "",
  
  // Escala Cincinnati
  asimetria_facial: "",
  paresia_brazos: "",
  alteracion_lenguaje: "",
  
  // Escala Trauma
  trauma_gcs: "",
  trauma_pas: "",
  trauma_fr: "",
  trauma_esfuerzo: "",
  trauma_llenado: "",
  trauma_total: "",
  
  // Datos madre
  madre_gesta: "",
  madre_para: "",
  madre_cesareas: "",
  madre_abortos: "",
  madre_fum: "",
  madre_semanas: "",
  madre_fecha_probable: "",
  madre_hora_contracciones: "",
  madre_frecuencia: "",
  madre_duracion: "",
  
  // Datos post-parto
  postparto_hora_nacimiento: "",
  postparto_lugar: "",
  postparto_placenta: false,
  
  // Datos recien nacido
  recien_nacido_apgar_1: "",
  recien_nacido_apgar_5: "",
  recien_nacido_apgar_10: "",
  recien_nacido_producto: "",
  recien_nacido_sexo: "",
  recien_nacido_destino: "",
  
  // Autoridades
  autoridades_intervinieron: "",
  
  // Negativa/Consentimiento
  negativa_atencion: false,
  consentimiento_informado: false,
  
  // Signatures
  firmas: {
    paciente: null,
    testigo: null,
    familiar_tutor: null,
    medico_recibe: null,
    entrega_paciente: null,
  }
};

export default function FRAPFormPage() {
  const { id } = useParams();
  const isEditing = !!id;
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const { user, getAuthHeaders, API } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  // Solo admin puede editar FRAPs existentes
  const canEdit = user?.role === 'admin';

  useEffect(() => {
    // Si está editando y no es admin, redirigir
    if (isEditing && !canEdit) {
      toast.error("Solo los administradores pueden editar FRAPs");
      navigate("/");
      return;
    }
    
    if (isEditing) {
      fetchFrap();
    }
  }, [id, canEdit]);

  const fetchFrap = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/fraps/${id}`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setFormData({ ...INITIAL_FORM_STATE, ...data });
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

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, value, checked) => {
    setFormData(prev => {
      const currentArray = prev[field] || [];
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] };
      } else {
        return { ...prev, [field]: currentArray.filter(item => item !== value) };
      }
    });
  };

  const handleVitalChange = (index, field, value) => {
    setFormData(prev => {
      const newVitales = [...(prev.vitales || [])];
      if (!newVitales[index]) {
        newVitales[index] = {};
      }
      newVitales[index] = { ...newVitales[index], [field]: value };
      return { ...prev, vitales: newVitales };
    });
  };

  const handleSignatureChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      firmas: { ...prev.firmas, [field]: value }
    }));
  };

  const handleZonasLesionChange = (zonas) => {
    setFormData(prev => ({ ...prev, zonas_lesion: zonas }));
  };

  const calculateGlasgowTotal = () => {
    const ocular = parseInt(formData.glasgow_ocular) || 0;
    const verbal = parseInt(formData.glasgow_verbal) || 0;
    const motor = parseInt(formData.glasgow_motor) || 0;
    return ocular + verbal + motor;
  };

  useEffect(() => {
    const total = calculateGlasgowTotal();
    if (total > 0) {
      setFormData(prev => ({ ...prev, glasgow_total: total.toString() }));
    }
  }, [formData.glasgow_ocular, formData.glasgow_verbal, formData.glasgow_motor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isEditing ? `${API}/fraps/${id}` : `${API}/fraps`;
      const method = isEditing ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        toast.success(isEditing ? "FRAP actualizado correctamente" : "FRAP creado correctamente");
        navigate("/");
      } else {
        const error = await response.json();
        toast.error(error.detail || "Error al guardar");
      }
    } catch (error) {
      toast.error("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="spinner" />
      </div>
    );
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
              <h1 className="font-bold text-lg">{isEditing ? "Editar FRAP" : "Nuevo FRAP"}</h1>
              <p className="text-xs text-muted-foreground">Rescate Ensenada</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="dark-mode-toggle"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="container mx-auto max-w-7xl px-4 py-6">
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 lg:grid-cols-6 mb-6">
              <TabsTrigger value="general" className="gap-2" data-testid="tab-general">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">General</span>
              </TabsTrigger>
              <TabsTrigger value="vitales" className="gap-2" data-testid="tab-vitales">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Vitales</span>
              </TabsTrigger>
              <TabsTrigger value="exploracion" className="gap-2" data-testid="tab-exploracion">
                <Stethoscope className="w-4 h-4" />
                <span className="hidden sm:inline">Exploración</span>
              </TabsTrigger>
              <TabsTrigger value="escalas" className="gap-2" data-testid="tab-escalas">
                <ClipboardList className="w-4 h-4" />
                <span className="hidden sm:inline">Escalas</span>
              </TabsTrigger>
              <TabsTrigger value="obstetricia" className="gap-2" data-testid="tab-obstetricia">
                <Baby className="w-4 h-4" />
                <span className="hidden sm:inline">Obstetricia</span>
              </TabsTrigger>
              <TabsTrigger value="firmas" className="gap-2" data-testid="tab-firmas">
                <PenTool className="w-4 h-4" />
                <span className="hidden sm:inline">Firmas</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB: GENERAL */}
            <TabsContent value="general" className="space-y-6">
              {/* Identification */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Identificación del Servicio</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Fecha</Label>
                    <Input
                      type="date"
                      value={formData.fecha}
                      onChange={(e) => handleChange("fecha", e.target.value)}
                      data-testid="input-fecha"
                    />
                  </div>
                  <div>
                    <Label>Folio <span className="text-xs text-muted-foreground">(automático si se deja vacío)</span></Label>
                    <Input
                      value={formData.folio}
                      onChange={(e) => handleChange("folio", e.target.value)}
                      placeholder="Ej: 1468 (opcional)"
                      data-testid="input-folio"
                    />
                  </div>
                  <div>
                    <Label>Hora Llamada</Label>
                    <Input
                      type="time"
                      value={formData.hora_llamada}
                      onChange={(e) => handleChange("hora_llamada", e.target.value)}
                      data-testid="input-hora-llamada"
                    />
                  </div>
                  <div>
                    <Label>Hora Salida</Label>
                    <Input
                      type="time"
                      value={formData.hora_salida}
                      onChange={(e) => handleChange("hora_salida", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Hora Llegada</Label>
                    <Input
                      type="time"
                      value={formData.hora_llegada_traslado}
                      onChange={(e) => handleChange("hora_llegada_traslado", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Hora Hospital</Label>
                    <Input
                      type="time"
                      value={formData.hora_llegada_hospital}
                      onChange={(e) => handleChange("hora_llegada_hospital", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Hora Base</Label>
                    <Input
                      type="time"
                      value={formData.hora_llegada_base}
                      onChange={(e) => handleChange("hora_llegada_base", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Motivo de Atencion */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Motivo de la Atención</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.motivo_atencion}
                    onValueChange={(value) => handleChange("motivo_atencion", value)}
                    className="flex flex-wrap gap-4"
                  >
                    {[
                      { value: "traslado_programado", label: "Traslado Programado" },
                      { value: "enfermedad", label: "Enfermedad" },
                      { value: "traumatismo", label: "Traumatismo" },
                      { value: "gineco", label: "Ginecoobstétrico" },
                    ].map(({ value, label }) => (
                      <div key={value} className="flex items-center gap-2">
                        <RadioGroupItem value={value} id={`motivo-${value}`} />
                        <Label htmlFor={`motivo-${value}`}>{label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Ubicacion del Servicio */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Ubicación del Servicio</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Calle</Label>
                    <Input
                      value={formData.ubicacion_calle}
                      onChange={(e) => handleChange("ubicacion_calle", e.target.value)}
                      data-testid="input-ubicacion-calle"
                    />
                  </div>
                  <div>
                    <Label>Entre</Label>
                    <Input
                      value={formData.ubicacion_entre}
                      onChange={(e) => handleChange("ubicacion_entre", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Colonia/Comunidad</Label>
                    <Input
                      value={formData.ubicacion_colonia}
                      onChange={(e) => handleChange("ubicacion_colonia", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Delegación/Municipio</Label>
                    <Input
                      value={formData.ubicacion_delegacion}
                      onChange={(e) => handleChange("ubicacion_delegacion", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="mb-2 block">Lugar de Ocurrencia</Label>
                    <RadioGroup
                      value={formData.lugar_ocurrencia}
                      onValueChange={(value) => handleChange("lugar_ocurrencia", value)}
                      className="flex flex-wrap gap-4"
                    >
                      {[
                        { value: "hogar", label: "Hogar" },
                        { value: "via_publica", label: "Vía Pública" },
                        { value: "trabajo", label: "Trabajo" },
                        { value: "escuela", label: "Escuela" },
                        { value: "recreacion", label: "Recreación/Deporte" },
                        { value: "transporte", label: "Transporte Público" },
                        { value: "otro", label: "Otra" },
                      ].map(({ value, label }) => (
                        <div key={value} className="flex items-center gap-2">
                          <RadioGroupItem value={value} id={`lugar-${value}`} />
                          <Label htmlFor={`lugar-${value}`}>{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              {/* Operador */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Personal y Ambulancia</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Número de Ambulancia</Label>
                    <Input
                      value={formData.numero_ambulancia}
                      onChange={(e) => handleChange("numero_ambulancia", e.target.value)}
                      data-testid="input-numero-ambulancia"
                    />
                  </div>
                  <div>
                    <Label>Operador</Label>
                    <Input
                      value={formData.operador}
                      onChange={(e) => handleChange("operador", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Prestadores del Servicio</Label>
                    <Input
                      value={formData.prestadores_servicio}
                      onChange={(e) => handleChange("prestadores_servicio", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Datos del Paciente */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Datos del Paciente</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label>Nombre del Paciente</Label>
                    <Input
                      value={formData.nombre_paciente}
                      onChange={(e) => handleChange("nombre_paciente", e.target.value)}
                      data-testid="input-nombre-paciente"
                    />
                  </div>
                  <div>
                    <Label>Sexo</Label>
                    <RadioGroup
                      value={formData.sexo}
                      onValueChange={(value) => handleChange("sexo", value)}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="masculino" id="sexo-m" />
                        <Label htmlFor="sexo-m">Masculino</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="femenino" id="sexo-f" />
                        <Label htmlFor="sexo-f">Femenino</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label>Edad (años)</Label>
                    <Input
                      type="number"
                      value={formData.edad_anos}
                      onChange={(e) => handleChange("edad_anos", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Edad (meses)</Label>
                    <Input
                      type="number"
                      value={formData.edad_meses}
                      onChange={(e) => handleChange("edad_meses", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Nombre del Acompañante</Label>
                    <Input
                      value={formData.nombre_acompanante}
                      onChange={(e) => handleChange("nombre_acompanante", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Domicilio</Label>
                    <Input
                      value={formData.domicilio}
                      onChange={(e) => handleChange("domicilio", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Colonia</Label>
                    <Input
                      value={formData.colonia_paciente}
                      onChange={(e) => handleChange("colonia_paciente", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Delegación/Municipio</Label>
                    <Input
                      value={formData.delegacion_paciente}
                      onChange={(e) => handleChange("delegacion_paciente", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <Input
                      value={formData.telefono}
                      onChange={(e) => handleChange("telefono", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Ocupación</Label>
                    <Input
                      value={formData.ocupacion}
                      onChange={(e) => handleChange("ocupacion", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Derechohabiente a</Label>
                    <Input
                      value={formData.derechohabiente}
                      onChange={(e) => handleChange("derechohabiente", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Compañía de Seguros</Label>
                    <Input
                      value={formData.compania_seguros}
                      onChange={(e) => handleChange("compania_seguros", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: VITALES */}
            <TabsContent value="vitales" className="space-y-6">
              {/* Nivel de Conciencia */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Nivel de Conciencia</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.nivel_conciencia}
                    onValueChange={(value) => handleChange("nivel_conciencia", value)}
                    className="flex flex-wrap gap-4"
                  >
                    {[
                      { value: "consciente", label: "Consciente" },
                      { value: "resp_verbal", label: "Resp. Estímulo Verbal" },
                      { value: "resp_dolor", label: "Resp. Estímulo Doloroso" },
                      { value: "inconsciente", label: "Inconsciente" },
                    ].map(({ value, label }) => (
                      <div key={value} className="flex items-center gap-2">
                        <RadioGroupItem value={value} id={`conc-${value}`} />
                        <Label htmlFor={`conc-${value}`}>{label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Via Aerea */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Vía Aérea y Ventilación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="mb-2 block">Vía Aérea</Label>
                    <RadioGroup
                      value={formData.via_aerea}
                      onValueChange={(value) => handleChange("via_aerea", value)}
                      className="flex flex-wrap gap-4"
                    >
                      {[
                        { value: "permeable", label: "Permeable" },
                        { value: "ausente", label: "Ausente" },
                        { value: "comprometida", label: "Comprometida" },
                      ].map(({ value, label }) => (
                        <div key={value} className="flex items-center gap-2">
                          <RadioGroupItem value={value} id={`via-${value}`} />
                          <Label htmlFor={`via-${value}`}>{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div>
                    <Label className="mb-2 block">Reflejo de Deglución</Label>
                    <RadioGroup
                      value={formData.reflejo_deglucion}
                      onValueChange={(value) => handleChange("reflejo_deglucion", value)}
                      className="flex flex-wrap gap-4"
                    >
                      {[
                        { value: "presente", label: "Presente" },
                        { value: "ausente", label: "Ausente" },
                        { value: "comprometida", label: "Comprometida" },
                      ].map(({ value, label }) => (
                        <div key={value} className="flex items-center gap-2">
                          <RadioGroupItem value={value} id={`ref-${value}`} />
                          <Label htmlFor={`ref-${value}`}>{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="pt-2">
                    <Label className="mb-3 block font-semibold">Ventilación</Label>
                    <RadioGroup
                      value={formData.ventilacion}
                      onValueChange={(value) => handleChange("ventilacion", value)}
                      className="grid grid-cols-2 md:grid-cols-3 gap-3"
                    >
                      {[
                        { value: "automatismo_regular", label: "Aut. Regular" },
                        { value: "automatismo_irregular", label: "Aut. Irregular" },
                        { value: "rapida", label: "Rápida" },
                        { value: "superficial", label: "Superficial" },
                        { value: "apnea", label: "Apnea" },
                      ].map(({ value, label }) => (
                        <div key={value} className="flex items-center gap-2">
                          <RadioGroupItem value={value} id={`vent-${value}`} />
                          <Label htmlFor={`vent-${value}`}>{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="pt-2">
                    <Label className="mb-3 block font-semibold">Auscultación</Label>
                    <RadioGroup
                      value={formData.auscultacion}
                      onValueChange={(value) => handleChange("auscultacion", value)}
                      className="grid grid-cols-2 md:grid-cols-3 gap-3"
                    >
                      {[
                        { value: "normales", label: "Ruidos Normales" },
                        { value: "disminuidos", label: "Disminuidos" },
                        { value: "ausentes", label: "Ausentes" },
                      ].map(({ value, label }) => (
                        <div key={value} className="flex items-center gap-2">
                          <RadioGroupItem value={value} id={`ausc-${value}`} />
                          <Label htmlFor={`ausc-${value}`}>{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              {/* Circulacion */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Circulación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Presencia de Pulsos</Label>
                    <RadioGroup
                      value={formData.presencia_pulsos}
                      onValueChange={(value) => handleChange("presencia_pulsos", value)}
                      className="flex flex-wrap gap-4"
                    >
                      {[
                        { value: "carotideo", label: "Carotídeo" },
                        { value: "radial", label: "Radial" },
                        { value: "paro", label: "Paro Cardiorespiratorio" },
                      ].map(({ value, label }) => (
                        <div key={value} className="flex items-center gap-2">
                          <RadioGroupItem value={value} id={`pulso-${value}`} />
                          <Label htmlFor={`pulso-${value}`}>{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div>
                    <Label className="mb-2 block">Calidad del Pulso</Label>
                    <RadioGroup
                      value={formData.calidad_pulso}
                      onValueChange={(value) => handleChange("calidad_pulso", value)}
                      className="flex flex-wrap gap-4"
                    >
                      {[
                        { value: "rapido", label: "Rápido" },
                        { value: "lento", label: "Lento" },
                        { value: "ritmico", label: "Rítmico" },
                        { value: "arritmico", label: "Arrítmico" },
                      ].map(({ value, label }) => (
                        <div key={value} className="flex items-center gap-2">
                          <RadioGroupItem value={value} id={`cal-${value}`} />
                          <Label htmlFor={`cal-${value}`}>{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div>
                    <Label className="mb-2 block">Piel</Label>
                    <RadioGroup
                      value={formData.piel}
                      onValueChange={(value) => handleChange("piel", value)}
                      className="flex flex-wrap gap-4"
                    >
                      {[
                        { value: "normal", label: "Normal" },
                        { value: "palida", label: "Pálida" },
                        { value: "caliente", label: "Caliente" },
                        { value: "fria", label: "Fría" },
                        { value: "cianotica", label: "Cianótica" },
                        { value: "diaforesis", label: "Diaforesis" },
                      ].map(({ value, label }) => (
                        <div key={value} className="flex items-center gap-2">
                          <RadioGroupItem value={value} id={`piel-${value}`} />
                          <Label htmlFor={`piel-${value}`}>{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              {/* Signos Vitales */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Signos Vitales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="vitals-table">
                      <thead>
                        <tr>
                          <th>HORA</th>
                          <th>FR</th>
                          <th>FC</th>
                          <th>TAS</th>
                          <th>TAD</th>
                          <th>SaO2</th>
                          <th>TEMP</th>
                          <th>GLUC</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[0, 1, 2].map((index) => (
                          <tr key={index}>
                            <td>
                              <Input
                                type="time"
                                value={formData.vitales?.[index]?.hora || ""}
                                onChange={(e) => handleVitalChange(index, "hora", e.target.value)}
                                className="border-0 h-8"
                              />
                            </td>
                            <td>
                              <Input
                                value={formData.vitales?.[index]?.fr || ""}
                                onChange={(e) => handleVitalChange(index, "fr", e.target.value)}
                                placeholder="rpm"
                                className="border-0 h-8"
                              />
                            </td>
                            <td>
                              <Input
                                value={formData.vitales?.[index]?.fc || ""}
                                onChange={(e) => handleVitalChange(index, "fc", e.target.value)}
                                placeholder="lpm"
                                className="border-0 h-8"
                              />
                            </td>
                            <td>
                              <Input
                                value={formData.vitales?.[index]?.tas || ""}
                                onChange={(e) => handleVitalChange(index, "tas", e.target.value)}
                                placeholder="mmHg"
                                className="border-0 h-8"
                              />
                            </td>
                            <td>
                              <Input
                                value={formData.vitales?.[index]?.tad || ""}
                                onChange={(e) => handleVitalChange(index, "tad", e.target.value)}
                                placeholder="mmHg"
                                className="border-0 h-8"
                              />
                            </td>
                            <td>
                              <Input
                                value={formData.vitales?.[index]?.sao2 || ""}
                                onChange={(e) => handleVitalChange(index, "sao2", e.target.value)}
                                placeholder="%"
                                className="border-0 h-8"
                              />
                            </td>
                            <td>
                              <Input
                                value={formData.vitales?.[index]?.temp || ""}
                                onChange={(e) => handleVitalChange(index, "temp", e.target.value)}
                                placeholder="°C"
                                className="border-0 h-8"
                              />
                            </td>
                            <td>
                              <Input
                                value={formData.vitales?.[index]?.gluc || ""}
                                onChange={(e) => handleVitalChange(index, "gluc", e.target.value)}
                                placeholder="mg/dL"
                                className="border-0 h-8"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Condicion y Prioridad */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Condición y Prioridad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Condición del Paciente</Label>
                    <RadioGroup
                      value={formData.condicion_paciente}
                      onValueChange={(value) => handleChange("condicion_paciente", value)}
                      className="flex flex-wrap gap-4"
                    >
                      {[
                        { value: "critico_inestable", label: "Crítico Inestable" },
                        { value: "critico_estable", label: "Crítico Estable" },
                        { value: "no_critico", label: "No Crítico" },
                      ].map(({ value, label }) => (
                        <div key={value} className="flex items-center gap-2">
                          <RadioGroupItem value={value} id={`cond-${value}`} />
                          <Label htmlFor={`cond-${value}`}>{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div>
                    <Label className="mb-2 block">Prioridad</Label>
                    <RadioGroup
                      value={formData.prioridad}
                      onValueChange={(value) => handleChange("prioridad", value)}
                      className="flex flex-wrap gap-4"
                    >
                      {[
                        { value: "rojo", label: "ROJO", color: "text-red-600" },
                        { value: "amarillo", label: "AMARILLO", color: "text-yellow-600" },
                        { value: "verde", label: "VERDE", color: "text-green-600" },
                        { value: "negro", label: "NEGRO", color: "text-black dark:text-white" },
                      ].map(({ value, label, color }) => (
                        <div key={value} className="flex items-center gap-2">
                          <RadioGroupItem value={value} id={`prio-${value}`} />
                          <Label htmlFor={`prio-${value}`} className={`font-bold ${color}`}>{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: EXPLORACION */}
            <TabsContent value="exploracion" className="space-y-6">
              {/* Origen Probable */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Origen Probable</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: "neurologia", label: "Neurología" },
                      { value: "cardiovascular", label: "Cardiovascular" },
                      { value: "respiratorio", label: "Respiratorio" },
                      { value: "metabolico", label: "Metabólico" },
                      { value: "digestiva", label: "Digestiva" },
                      { value: "urogenital", label: "Urogenital" },
                      { value: "gineco", label: "Gineco-Obstétrica" },
                      { value: "cognitivo", label: "Cognitivo Emocional" },
                      { value: "intoxicacion", label: "Intoxicación" },
                      { value: "infecciosa", label: "Infecciosa" },
                      { value: "oncologico", label: "Oncológico" },
                    ].map(({ value, label }) => (
                      <div key={value} className="flex items-center gap-2">
                        <Checkbox
                          id={`origen-${value}`}
                          checked={(formData.origen_probable || []).includes(value)}
                          onCheckedChange={(checked) => handleArrayChange("origen_probable", value, checked)}
                        />
                        <Label htmlFor={`origen-${value}`}>{label}</Label>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Label>Otro (especificar)</Label>
                    <Input
                      value={formData.origen_probable_otro}
                      onChange={(e) => handleChange("origen_probable_otro", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Exploracion Fisica */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Exploración Física</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {[
                      { value: "deformidades", label: "1. Deformidades" },
                      { value: "contusiones", label: "2. Contusiones" },
                      { value: "abrasiones", label: "3. Abrasiones" },
                      { value: "penetraciones", label: "4. Penetraciones" },
                      { value: "mov_paradojico", label: "5. Mov. Paradójico" },
                      { value: "crepitacion", label: "6. Crepitación" },
                      { value: "heridas", label: "7. Heridas" },
                      { value: "fracturas", label: "8. Fracturas" },
                      { value: "enfisema", label: "9. Enfisema Subcut." },
                      { value: "quemaduras", label: "10. Quemaduras" },
                      { value: "laceraciones", label: "11. Laceraciones" },
                      { value: "edema", label: "12. Edema" },
                      { value: "alt_sensibilidad", label: "13. Alt. Sensibilidad" },
                      { value: "alt_movilidad", label: "14. Alt. Movilidad" },
                      { value: "dolor", label: "15. Dolor" },
                    ].map(({ value, label }) => (
                      <div key={value} className="flex items-center gap-2">
                        <Checkbox
                          id={`exp-${value}`}
                          checked={(formData.exploracion_fisica || []).includes(value)}
                          onCheckedChange={(checked) => handleArrayChange("exploracion_fisica", value, checked)}
                        />
                        <Label htmlFor={`exp-${value}`} className="text-sm">{label}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Diagrama del Cuerpo - Zonas de Lesión */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Zonas de Lesión - Diagrama Corporal</CardTitle>
                </CardHeader>
                <CardContent>
                  <BodyDiagram
                    value={formData.zonas_lesion}
                    onChange={handleZonasLesionChange}
                  />
                </CardContent>
              </Card>

              {/* Pupilas */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Pupilas</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Pupila Derecha</Label>
                    <RadioGroup
                      value={formData.pupilas_derecha}
                      onValueChange={(value) => handleChange("pupilas_derecha", value)}
                      className="flex flex-wrap gap-4 mt-2"
                    >
                      {[
                        { value: "reactiva", label: "Reactiva" },
                        { value: "no_reactiva", label: "No Reactiva" },
                        { value: "miosis", label: "Miosis" },
                        { value: "midriasis", label: "Midriasis" },
                      ].map(({ value, label }) => (
                        <div key={value} className="flex items-center gap-2">
                          <RadioGroupItem value={value} id={`pup-d-${value}`} />
                          <Label htmlFor={`pup-d-${value}`}>{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div>
                    <Label>Pupila Izquierda</Label>
                    <RadioGroup
                      value={formData.pupilas_izquierda}
                      onValueChange={(value) => handleChange("pupilas_izquierda", value)}
                      className="flex flex-wrap gap-4 mt-2"
                    >
                      {[
                        { value: "reactiva", label: "Reactiva" },
                        { value: "no_reactiva", label: "No Reactiva" },
                        { value: "miosis", label: "Miosis" },
                        { value: "midriasis", label: "Midriasis" },
                      ].map(({ value, label }) => (
                        <div key={value} className="flex items-center gap-2">
                          <RadioGroupItem value={value} id={`pup-i-${value}`} />
                          <Label htmlFor={`pup-i-${value}`}>{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              {/* Manejo */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Manejo Vía Aérea, Control Cervical y Oxigenoterapia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Manejo Vía Aérea</Label>
                    <div className="flex flex-wrap gap-4">
                      {[
                        { value: "aspiracion", label: "Aspiración" },
                        { value: "canula_oro", label: "Cánula Orofaríngea" },
                        { value: "canula_naso", label: "Cánula Nasofaríngea" },
                      ].map(({ value, label }) => (
                        <div key={value} className="flex items-center gap-2">
                          <Checkbox
                            id={`manejo-${value}`}
                            checked={(formData.via_aerea_manejo || []).includes(value)}
                            onCheckedChange={(checked) => handleArrayChange("via_aerea_manejo", value, checked)}
                          />
                          <Label htmlFor={`manejo-${value}`}>{label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="mb-2 block">Control Cervical</Label>
                    <RadioGroup
                      value={formData.control_cervical}
                      onValueChange={(value) => handleChange("control_cervical", value)}
                      className="flex flex-wrap gap-4"
                    >
                      {[
                        { value: "manual", label: "Manual" },
                        { value: "rigido", label: "Collarín Rígido" },
                        { value: "blando", label: "Collarín Blando" },
                      ].map(({ value, label }) => (
                        <div key={value} className="flex items-center gap-2">
                          <RadioGroupItem value={value} id={`cerv-${value}`} />
                          <Label htmlFor={`cerv-${value}`}>{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div>
                    <Label className="mb-2 block">Asistencia Ventilatoria</Label>
                    <RadioGroup
                      value={formData.asistencia_ventilatoria}
                      onValueChange={(value) => handleChange("asistencia_ventilatoria", value)}
                      className="flex flex-wrap gap-4"
                    >
                      {[
                        { value: "balon_valvula", label: "Balón-Válvula Mascarilla" },
                        { value: "ventilador", label: "Ventilador Automático" },
                      ].map(({ value, label }) => (
                        <div key={value} className="flex items-center gap-2">
                          <RadioGroupItem value={value} id={`asist-${value}`} />
                          <Label htmlFor={`asist-${value}`}>{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {formData.asistencia_ventilatoria === 'ventilador' && (
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <Label>Frecuencia</Label>
                          <Input
                            value={formData.ventilador_frec}
                            onChange={(e) => handleChange("ventilador_frec", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Volumen</Label>
                          <Input
                            value={formData.ventilador_vol}
                            onChange={(e) => handleChange("ventilador_vol", e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="mb-2 block">Oxigenoterapia</Label>
                    <RadioGroup
                      value={formData.oxigenoterapia}
                      onValueChange={(value) => handleChange("oxigenoterapia", value)}
                      className="flex flex-wrap gap-4"
                    >
                      {[
                        { value: "puntas_nasales", label: "Puntas Nasales" },
                        { value: "mascarilla_simple", label: "Mascarilla Simple" },
                        { value: "mascarilla_reservorio", label: "Mascarilla c/ Reservorio" },
                      ].map(({ value, label }) => (
                        <div key={value} className="flex items-center gap-2">
                          <RadioGroupItem value={value} id={`oxi-${value}`} />
                          <Label htmlFor={`oxi-${value}`}>{label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>LTS x MIN</Label>
                      <Input
                        value={formData.lts_x_min}
                        onChange={(e) => handleChange("lts_x_min", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Control Hemorragias y Vías Venosas */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Control de Hemorragias y Vías Venosas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Control de Hemorragias</Label>
                    <div className="flex flex-wrap gap-4">
                      {[
                        { value: "presion_directa", label: "Presión Directa" },
                        { value: "torniquete", label: "Torniquete" },
                        { value: "vendaje", label: "Vendaje Compresivo" },
                      ].map(({ value, label }) => (
                        <div key={value} className="flex items-center gap-2">
                          <Checkbox
                            id={`hem-${value}`}
                            checked={(formData.control_hemorragias || []).includes(value)}
                            onCheckedChange={(checked) => handleArrayChange("control_hemorragias", value, checked)}
                          />
                          <Label htmlFor={`hem-${value}`}>{label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Vía IV #</Label>
                      <Input
                        value={formData.via_iv_num}
                        onChange={(e) => handleChange("via_iv_num", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Catéter #</Label>
                      <Input
                        value={formData.cateter_num}
                        onChange={(e) => handleChange("cateter_num", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Sitio de Aplicación</Label>
                      <Input
                        value={formData.sitio_aplicacion}
                        onChange={(e) => handleChange("sitio_aplicacion", e.target.value)}
                        placeholder="Mano, Pliegue antecubital..."
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="mb-2 block">Tipo de Soluciones</Label>
                    <div className="flex flex-wrap gap-4">
                      {[
                        { value: "hartmann", label: "Hartmann" },
                        { value: "nacl", label: "NaCl 0.9%" },
                        { value: "mixta", label: "Mixta" },
                        { value: "glucosa", label: "Glucosa 5%" },
                        { value: "otra", label: "Otra" },
                      ].map(({ value, label }) => (
                        <div key={value} className="flex items-center gap-2">
                          <Checkbox
                            id={`sol-${value}`}
                            checked={(formData.tipo_soluciones || []).includes(value)}
                            onCheckedChange={(checked) => handleArrayChange("tipo_soluciones", value, checked)}
                          />
                          <Label htmlFor={`sol-${value}`}>{label}</Label>
                        </div>
                      ))}
                    </div>
                    {(formData.tipo_soluciones || []).includes('otra') && (
                      <div className="mt-2">
                        <Label>Especificar otra solución</Label>
                        <Input
                          value={formData.tipo_soluciones_otra}
                          onChange={(e) => handleChange("tipo_soluciones_otra", e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Accidente */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    Accidente Automovilístico
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="mb-2 block">Colisión</Label>
                      <RadioGroup
                        value={formData.accidente_colision}
                        onValueChange={(value) => handleChange("accidente_colision", value)}
                        className="space-y-1"
                      >
                        {["automotor", "motocicleta", "volcadura", "bicicleta", "maquinaria"].map((val) => (
                          <div key={val} className="flex items-center gap-2">
                            <RadioGroupItem value={val} id={`col-${val}`} />
                            <Label htmlFor={`col-${val}`} className="capitalize">{val}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div>
                      <Label className="mb-2 block">Impacto</Label>
                      <RadioGroup
                        value={formData.accidente_impacto}
                        onValueChange={(value) => handleChange("accidente_impacto", value)}
                        className="space-y-1"
                      >
                        {["frontal", "lateral", "posterior"].map((val) => (
                          <div key={val} className="flex items-center gap-2">
                            <RadioGroupItem value={val} id={`imp-${val}`} />
                            <Label htmlFor={`imp-${val}`} className="capitalize">{val}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div>
                      <Label className="mb-2 block">Cinturón de Seguridad</Label>
                      <RadioGroup
                        value={formData.cinturon_seguridad}
                        onValueChange={(value) => handleChange("cinturon_seguridad", value)}
                        className="space-y-1"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="colocado" id="cint-si" />
                          <Label htmlFor="cint-si">Colocado</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="no_colocado" id="cint-no" />
                          <Label htmlFor="cint-no">No Colocado</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label className="mb-2 block">Bolsa de Aire</Label>
                      <RadioGroup
                        value={formData.bolsa_aire}
                        onValueChange={(value) => handleChange("bolsa_aire", value)}
                        className="space-y-1"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="si" id="bolsa-si" />
                          <Label htmlFor="bolsa-si">Sí</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="no" id="bolsa-no" />
                          <Label htmlFor="bolsa-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label className="mb-2 block">Casco de Seguridad</Label>
                      <RadioGroup
                        value={formData.casco_seguridad}
                        onValueChange={(value) => handleChange("casco_seguridad", value)}
                        className="space-y-1"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="si" id="casco-si" />
                          <Label htmlFor="casco-si">Sí</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="no" id="casco-no" />
                          <Label htmlFor="casco-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label className="mb-2 block">Eyectado</Label>
                      <RadioGroup
                        value={formData.eyectado}
                        onValueChange={(value) => handleChange("eyectado", value)}
                        className="space-y-1"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="si" id="eyec-si" />
                          <Label htmlFor="eyec-si">Sí</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="no" id="eyec-no" />
                          <Label htmlFor="eyec-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Agente Causal */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Agente Causal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[
                      { value: "arma", label: "Arma" },
                      { value: "juguete", label: "Juguete" },
                      { value: "automotor", label: "Automotor" },
                      { value: "producto_caliente", label: "Producto Caliente" },
                      { value: "sustancia_biologica", label: "Sustancia Biológica" },
                      { value: "sustancia_toxica", label: "Sustancia Tóxica" },
                      { value: "maquinaria", label: "Maquinaria" },
                      { value: "herramienta", label: "Herramienta" },
                      { value: "fuego", label: "Fuego" },
                      { value: "electricidad", label: "Electricidad" },
                      { value: "explosion", label: "Explosión" },
                      { value: "ser_humano", label: "Ser Humano" },
                      { value: "animal", label: "Animal" },
                    ].map(({ value, label }) => (
                      <div key={value} className="flex items-center gap-2">
                        <Checkbox
                          id={`agente-${value}`}
                          checked={(formData.agente_causal || []).includes(value)}
                          onCheckedChange={(checked) => handleArrayChange("agente_causal", value, checked)}
                        />
                        <Label htmlFor={`agente-${value}`} className="text-sm">{label}</Label>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4">
                    <Label>Otro Agente Causal (Especificar)</Label>
                    <Input
                      value={formData.agente_causal_otro}
                      onChange={(e) => handleChange("agente_causal_otro", e.target.value)}
                      placeholder="Especifique otro agente causal"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Lesiones Causadas Por */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Lesiones Causadas Por</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.lesiones_causadas_por}
                    onChange={(e) => handleChange("lesiones_causadas_por", e.target.value)}
                    placeholder="Describa cómo se causaron las lesiones..."
                    rows={3}
                    className="w-full"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: ESCALAS */}
            <TabsContent value="escalas" className="space-y-6">
              {/* Interrogatorio SAMPLE */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Interrogatorio (SAMPLE)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Alergias</Label>
                    <Input
                      value={formData.alergias}
                      onChange={(e) => handleChange("alergias", e.target.value)}
                      placeholder="Alergias conocidas"
                    />
                  </div>
                  <div>
                    <Label>Medicamentos que está ingiriendo</Label>
                    <Input
                      value={formData.medicamentos}
                      onChange={(e) => handleChange("medicamentos", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Enfermedades y cirugías previas</Label>
                    <Textarea
                      value={formData.enfermedades_previas}
                      onChange={(e) => handleChange("enfermedades_previas", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Hora de la última comida</Label>
                    <Input
                      type="time"
                      value={formData.ultima_comida}
                      onChange={(e) => handleChange("ultima_comida", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Eventos previos relacionados</Label>
                    <Textarea
                      value={formData.eventos_previos}
                      onChange={(e) => handleChange("eventos_previos", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Observaciones */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Observaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.observaciones}
                    onChange={(e) => handleChange("observaciones", e.target.value)}
                    rows={4}
                    placeholder="Observaciones adicionales..."
                  />
                </CardContent>
              </Card>

              {/* Escala Glasgow */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Escala de Glasgow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Apertura Ocular (1-4)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="4"
                        value={formData.glasgow_ocular}
                        onChange={(e) => handleChange("glasgow_ocular", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        4=Espontánea, 3=Al hablarle, 2=Al dolor, 1=Ninguna
                      </p>
                    </div>
                    <div>
                      <Label>Respuesta Verbal (1-5)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="5"
                        value={formData.glasgow_verbal}
                        onChange={(e) => handleChange("glasgow_verbal", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        5=Orientada, 4=Confusa, 3=Inapropiada, 2=Incomprensible, 1=Ninguna
                      </p>
                    </div>
                    <div>
                      <Label>Respuesta Motora (1-6)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="6"
                        value={formData.glasgow_motor}
                        onChange={(e) => handleChange("glasgow_motor", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        6=Obedece, 5=Localiza, 4=Retira, 3=Flexión, 2=Extensión, 1=Ninguna
                      </p>
                    </div>
                    <div>
                      <Label>Total Glasgow</Label>
                      <Input
                        type="number"
                        value={formData.glasgow_total}
                        readOnly
                        className="font-bold text-lg bg-muted"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Calculado automáticamente
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Escala Cincinnati */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Escala Prehospitalaria de Cincinnati</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="mb-2 block">Asimetría Facial</Label>
                      <RadioGroup
                        value={formData.asimetria_facial}
                        onValueChange={(value) => handleChange("asimetria_facial", value)}
                        className="flex gap-4"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="si" id="asim-si" />
                          <Label htmlFor="asim-si">Sí</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="no" id="asim-no" />
                          <Label htmlFor="asim-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label className="mb-2 block">Paresia de los Brazos</Label>
                      <RadioGroup
                        value={formData.paresia_brazos}
                        onValueChange={(value) => handleChange("paresia_brazos", value)}
                        className="flex gap-4"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="si" id="pare-si" />
                          <Label htmlFor="pare-si">Sí</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="no" id="pare-no" />
                          <Label htmlFor="pare-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label className="mb-2 block">Alteración del Lenguaje</Label>
                      <RadioGroup
                        value={formData.alteracion_lenguaje}
                        onValueChange={(value) => handleChange("alteracion_lenguaje", value)}
                        className="flex gap-4"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="si" id="alt-si" />
                          <Label htmlFor="alt-si">Sí</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="no" id="alt-no" />
                          <Label htmlFor="alt-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Escala Trauma */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Escala de Trauma</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div>
                      <Label>(A) GCS</Label>
                      <Input
                        value={formData.trauma_gcs}
                        onChange={(e) => handleChange("trauma_gcs", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>(B) PAS</Label>
                      <Input
                        value={formData.trauma_pas}
                        onChange={(e) => handleChange("trauma_pas", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>(C) FR</Label>
                      <Input
                        value={formData.trauma_fr}
                        onChange={(e) => handleChange("trauma_fr", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>(D) Esfuerzo Resp.</Label>
                      <Input
                        value={formData.trauma_esfuerzo}
                        onChange={(e) => handleChange("trauma_esfuerzo", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>(E) Llenado Capilar</Label>
                      <Input
                        value={formData.trauma_llenado}
                        onChange={(e) => handleChange("trauma_llenado", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Total</Label>
                      <Input
                        value={formData.trauma_total}
                        onChange={(e) => handleChange("trauma_total", e.target.value)}
                        className="font-bold"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: OBSTETRICIA */}
            <TabsContent value="obstetricia" className="space-y-6">
              {/* Datos de la Madre */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Baby className="w-5 h-5 text-pink-500" />
                    Datos de la Madre
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <Label>Gesta</Label>
                      <Input
                        value={formData.madre_gesta}
                        onChange={(e) => handleChange("madre_gesta", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Cesáreas</Label>
                      <Input
                        value={formData.madre_cesareas}
                        onChange={(e) => handleChange("madre_cesareas", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Para</Label>
                      <Input
                        value={formData.madre_para}
                        onChange={(e) => handleChange("madre_para", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Abortos</Label>
                      <Input
                        value={formData.madre_abortos}
                        onChange={(e) => handleChange("madre_abortos", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>FUM</Label>
                      <Input
                        type="date"
                        value={formData.madre_fum}
                        onChange={(e) => handleChange("madre_fum", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Semanas de Gestación</Label>
                      <Input
                        value={formData.madre_semanas}
                        onChange={(e) => handleChange("madre_semanas", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Fecha Probable de Parto</Label>
                      <Input
                        type="date"
                        value={formData.madre_fecha_probable}
                        onChange={(e) => handleChange("madre_fecha_probable", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Hora Inicio Contracciones</Label>
                      <Input
                        type="time"
                        value={formData.madre_hora_contracciones}
                        onChange={(e) => handleChange("madre_hora_contracciones", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Frecuencia</Label>
                      <Input
                        value={formData.madre_frecuencia}
                        onChange={(e) => handleChange("madre_frecuencia", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Duración</Label>
                      <Input
                        value={formData.madre_duracion}
                        onChange={(e) => handleChange("madre_duracion", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Datos Post-Parto */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Datos Post-Parto</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Hora de Nacimiento</Label>
                      <Input
                        type="time"
                        value={formData.postparto_hora_nacimiento}
                        onChange={(e) => handleChange("postparto_hora_nacimiento", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Lugar</Label>
                      <Input
                        value={formData.postparto_lugar}
                        onChange={(e) => handleChange("postparto_lugar", e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-6">
                      <Checkbox
                        id="placenta"
                        checked={formData.postparto_placenta}
                        onCheckedChange={(checked) => handleChange("postparto_placenta", checked)}
                      />
                      <Label htmlFor="placenta">Placenta Expulsada</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Datos Recien Nacido */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Datos del Recién Nacido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <Label>APGAR 1 min</Label>
                      <Input
                        value={formData.recien_nacido_apgar_1}
                        onChange={(e) => handleChange("recien_nacido_apgar_1", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>APGAR 5 min</Label>
                      <Input
                        value={formData.recien_nacido_apgar_5}
                        onChange={(e) => handleChange("recien_nacido_apgar_5", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>APGAR 10 min</Label>
                      <Input
                        value={formData.recien_nacido_apgar_10}
                        onChange={(e) => handleChange("recien_nacido_apgar_10", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="mb-2 block">Producto</Label>
                      <RadioGroup
                        value={formData.recien_nacido_producto}
                        onValueChange={(value) => handleChange("recien_nacido_producto", value)}
                        className="flex gap-4"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="vivo" id="prod-vivo" />
                          <Label htmlFor="prod-vivo">Vivo</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="muerto" id="prod-muerto" />
                          <Label htmlFor="prod-muerto">Muerto</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label className="mb-2 block">Sexo</Label>
                      <RadioGroup
                        value={formData.recien_nacido_sexo}
                        onValueChange={(value) => handleChange("recien_nacido_sexo", value)}
                        className="flex gap-4"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="masculino" id="rn-m" />
                          <Label htmlFor="rn-m">Masculino</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="femenino" id="rn-f" />
                          <Label htmlFor="rn-f">Femenino</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label className="mb-2 block">Destino</Label>
                      <RadioGroup
                        value={formData.recien_nacido_destino}
                        onValueChange={(value) => handleChange("recien_nacido_destino", value)}
                        className="flex flex-wrap gap-4"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="trasladado" id="dest-tras" />
                          <Label htmlFor="dest-tras">Trasladado</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="no_trasladado" id="dest-notras" />
                          <Label htmlFor="dest-notras">No Trasladado</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="fuga" id="dest-fuga" />
                          <Label htmlFor="dest-fuga">Fuga</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: FIRMAS */}
            <TabsContent value="firmas" className="space-y-6">
              {/* Autoridades */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Autoridades que Intervinieron</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.autoridades_intervinieron}
                    onChange={(e) => handleChange("autoridades_intervinieron", e.target.value)}
                    rows={2}
                    placeholder="Policía, Cruz Roja, Bomberos, etc."
                  />
                </CardContent>
              </Card>

              {/* Negativa */}
              <Card className="border-red-200 dark:border-red-900">
                <CardHeader className="bg-red-50 dark:bg-red-950/30">
                  <CardTitle className="text-base text-red-700 dark:text-red-400">
                    NEGATIVA A RECIBIR ATENCIÓN / SER TRASLADADO EXIMENTE DE RESPONSABILIDAD
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="bg-muted p-4 rounded-lg mb-4 text-sm">
                    <p className="font-medium mb-2">DECLARO QUE NO ACEPTO LAS RECOMENDACIONES DEL PERSONAL DE LA AMBULANCIA DEL CUERPO DE RESCATE EN CUANTO AL (TRATAMIENTO) Y/O (TRASLADO) A UN HOSPITAL; POR LO QUE EXIMO A EL CUERPO DE RESCATE Y A DICHAS PERSONAS DE TODA RESPONSABILIDAD QUE PUDIERA DERIVAR AL HABER RESPETADO Y CUMPLIDO MI DECISIÓN.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="negativa"
                      checked={formData.negativa_atencion}
                      onCheckedChange={(checked) => handleChange("negativa_atencion", checked)}
                    />
                    <Label htmlFor="negativa" className="text-red-600 dark:text-red-400 font-medium">
                      El paciente/familiar firma la negativa
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Consentimiento */}
              <Card className="border-green-200 dark:border-green-900">
                <CardHeader className="bg-green-50 dark:bg-green-950/30">
                  <CardTitle className="text-base text-green-700 dark:text-green-400">
                    CONSENTIMIENTO INFORMADO
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="bg-muted p-4 rounded-lg mb-4 text-sm">
                    <p className="font-medium">PREVIO A UNA DETALLADA EXPLICACIÓN DOY MI CONSENTIMIENTO A SER TRASLADADO Y/O ATENDIDO POR EL PERSONAL DEL CUERPO DE RESCATE A.C.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="consentimiento"
                      checked={formData.consentimiento_informado}
                      onCheckedChange={(checked) => handleChange("consentimiento_informado", checked)}
                    />
                    <Label htmlFor="consentimiento" className="text-green-600 dark:text-green-400 font-medium">
                      El paciente/familiar da su consentimiento
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Firmas */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <PenTool className="w-5 h-5" />
                    Firmas Digitales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SignaturePad
                      label="Nombre/Firma del Paciente"
                      value={formData.firmas?.paciente}
                      onChange={(val) => handleSignatureChange("paciente", val)}
                    />
                    <SignaturePad
                      label="Nombre/Firma del Testigo"
                      value={formData.firmas?.testigo}
                      onChange={(val) => handleSignatureChange("testigo", val)}
                    />
                    <SignaturePad
                      label="Nombre/Firma de Familiar o Tutor"
                      value={formData.firmas?.familiar_tutor}
                      onChange={(val) => handleSignatureChange("familiar_tutor", val)}
                    />
                    <SignaturePad
                      label="Médico que Recibe - Nombre y Firma"
                      value={formData.firmas?.medico_recibe}
                      onChange={(val) => handleSignatureChange("medico_recibe", val)}
                    />
                    <SignaturePad
                      label="Entrega Paciente - Nombre y Firma"
                      value={formData.firmas?.entrega_paciente}
                      onChange={(val) => handleSignatureChange("entrega_paciente", val)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 mt-8 sticky bottom-4 bg-background/95 backdrop-blur p-4 rounded-lg border shadow-lg">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
              data-testid="cancel-btn"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 min-w-[150px]"
              data-testid="save-frap-btn"
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <div className="spinner" />
                  <span>Guardando...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  <span>{isEditing ? "Actualizar FRAP" : "Guardar FRAP"}</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
