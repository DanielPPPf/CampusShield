# **6. Historias de Usuario**

**6.1 Marco metodológico INVEST**

Cada historia de usuario fue evaluada y reformulada para cumplir los
seis principios INVEST, garantizando que sean adecuadas para su
planificación y desarrollo dentro de un sprint:

-   Independiente: la historia puede desarrollarse y desplegarse sin
    requerir que otra esté terminada en su totalidad, aunque puede
    existir dependencia funcional de datos.

-   Negociable: el alcance puede ajustarse en la planificación del
    sprint sin perder el valor central de la historia.

-   Valiosa: el beneficio para el usuario final es explícito y medible
    en el enunciado ("para que\...").

-   Estimable: el alcance está delimitado para que el equipo pueda
    asignar una estimación de esfuerzo razonable.

-   Small (pequeña): cada historia cabe en un sprint de dos semanas para
    el equipo de cuatro personas.

-   Testeable: los criterios de aceptación en formato Gherkin permiten
    verificar objetivamente si la historia está completa.

## **6.2 Escala de estimación - Fibonacci**

La estimación en story points utiliza la secuencia de Fibonacci (1, 2,
3, 5, 8, 13) porque sus saltos no lineales reflejan mejor la
incertidumbre real al estimar tareas de software, forzando al equipo a
reconocer y discutir explícitamente la complejidad:

  ----------------------------------------------------------------------------------
  **Puntos**   **Nivel**      **Descripción**                    **Criterio
                                                                 orientador**
  ------------ -------------- ---------------------------------- -------------------
  **1**        **Trivial**    Tarea simple y bien definida, sin  *CRUD básico,
                              dependencias externas ni lógica    cambio de UI sin
                              compleja.                          lógica*

  **2**        **Simple**     Pequeño desarrollo con lógica      *Formulario simple
                              conocida y una única integración   con validación*
                              de bajo riesgo.                    

  **3**        **Moderada**   Requiere diseño y pruebas, con     *Integración de API
                              alguna integración conocida pero   existente*
                              sin incertidumbre alta.            

  **5**        **Media**      Múltiples integraciones técnicas,  *Módulo con estado
                              lógica de negocio no trivial y     y vistas múltiples*
                              posible incertidumbre.             

  **8**        **Compleja**   Alta complejidad técnica,          *Generación de
                              múltiples dependencias entre capas reportes + cron
                              o módulos del sistema.             jobs*

  **13**       **Muy          Máxima complejidad estimable.      *Pipeline ML con
               compleja**     Candidata a subdividirse en sprint re-entrenamiento*
                              planning.                          
  ----------------------------------------------------------------------------------

## **6.3 Historias de Usuario --- Comunidad Universitaria**

+-----------------------------------------------------------------------+
| **HU-CU-01 --- Reporte de incidente en tiempo real --- Story Points:  |
| 5 (Media)**                                                           |
+=======================================================================+
| **Actor:** Comunidad Universitaria (CU)                               |
+-----------------------------------------------------------------------+
| **Historia**                                                          |
|                                                                       |
| *Como miembro de la comunidad universitaria, quiero reportar un       |
| incidente de seguridad en menos de tres pasos desde mi celular o      |
| computador, para que el equipo de seguridad sea notificado            |
| inmediatamente junto con mi ubicación exacta.*                        |
+-----------------------------------------------------------------------+
| **Valor de negocio**                                                  |
|                                                                       |
| Permite registrar incidentes con geolocalización precisa y            |
| trazabilidad formal, reemplazando el reporte verbal o por WhatsApp    |
| que actualmente carece de tiempo de respuesta definido.               |
+-----------------------------------------------------------------------+
| **Estimabilidad e Independencia (INVEST)**                            |
|                                                                       |
| La historia es técnicamente independiente: solo requiere el módulo de |
| autenticación (RF-SYS-01) y acceso a GPS, sin dependencias de         |
| componentes de analítica o ML. El alcance funcional está claramente   |
| delimitado en tres pasos, lo que permite estimarla y planificarla     |
| dentro de un sprint sin bloquear otras historias. Cumple plenamente   |
| los seis principios INVEST; su dependencia de datos del módulo de     |
| notificaciones es funcional, no técnica.                              |
+-----------------------------------------------------------------------+
| **Justificación de story points**                                     |
|                                                                       |
| La historia requiere integración de GPS (expo-location en mobile /    |
| Geolocation API en web), flujo de estado en 3 pasos, modo anónimo con |
| disociación de identidad en backend, soporte offline con cola de      |
| sincronización, y validación de datos. Múltiples capas técnicas con   |
| dependencias entre frontend, backend y base de datos geoespacial: 5   |
| puntos.                                                               |
+-----------------------------------------------------------------------+
| **Criterios de aceptación (Gherkin) --- IEEE 830 §3.6**               |
+-----------------------------------------------------------------------+
| **Feature: Reporte de incidente**                                     |
|                                                                       |
| **Scenario: El usuario completa el reporte en exactamente 3 pasos**   |
|                                                                       |
| > **Given** el usuario está autenticado en CampusShield               |
| >                                                                     |
| > **When** abre el módulo de reporte                                  |
| >                                                                     |
| > **Then** el formulario presenta el paso 1: selección del tipo de    |
| > incidente                                                           |
| >                                                                     |
| > **And** el paso 2: confirmación de ubicación GPS capturada          |
| > automáticamente                                                     |
| >                                                                     |
| > **And** el paso 3: confirmación y envío                             |
| >                                                                     |
| > **And** no existe ningún paso adicional obligatorio                 |
|                                                                       |
| **Scenario: El reporte se registra en la base de datos en menos de 5  |
| segundos**                                                            |
|                                                                       |
| > **Given** el usuario ha completado el formulario de 3 pasos         |
| >                                                                     |
| > **When** presiona \"Enviar\"                                        |
| >                                                                     |
| > **Then** el reporte queda persistido con timestamp y coordenadas    |
| > GPS en menos de 5 segundos                                          |
| >                                                                     |
| > **And** el usuario recibe confirmación visual con un número de caso |
| > único                                                               |
|                                                                       |
| **Scenario: Reporte anónimo no expone identidad del usuario**         |
|                                                                       |
| > **Given** el usuario activa el modo \"Anónimo\" antes de enviar     |
| >                                                                     |
| > **When** el sistema procesa el reporte                              |
| >                                                                     |
| > **Then** el campo de identidad del reportante aparece como          |
| > \"Anónimo\"                                                         |
| >                                                                     |
| > **And** ningún dato de identificación del usuario queda almacenado  |
| > junto al reporte                                                    |
|                                                                       |
| **Scenario: Cola offline con sincronización automática**              |
|                                                                       |
| > **Given** el dispositivo no tiene conexión a internet al enviar     |
| >                                                                     |
| > **When** el usuario completa y confirma el reporte                  |
| >                                                                     |
| > **Then** el sistema almacena el reporte en cola local               |
| >                                                                     |
| > **And** lo sincroniza automáticamente al recuperar conectividad sin |
| > intervención del usuario                                            |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **HU-CU-02 --- Mapa interactivo de zonas críticas --- Story Points: 5 |
| (Media)**                                                             |
+=======================================================================+
| **Actor:** Comunidad Universitaria (CU)                               |
+-----------------------------------------------------------------------+
| **Historia**                                                          |
|                                                                       |
| *Como miembro de la comunidad universitaria, quiero consultar un mapa |
| que muestre las zonas del campus según su nivel de riesgo actualizado |
| en tiempo real, para decidir por cuál ruta desplazarme de forma más   |
| segura antes de salir.*                                               |
+-----------------------------------------------------------------------+
| **Valor de negocio**                                                  |
|                                                                       |
| Proporciona información visual y actualizada sobre el estado de       |
| seguridad de las zonas críticas identificadas (Ad Portas, puente      |
| peatonal, puerta de madera, entrada sur), transformando datos crudos  |
| de incidentes en información accionable para la comunidad.            |
+-----------------------------------------------------------------------+
| **Estimabilidad e Independencia (INVEST)**                            |
|                                                                       |
| La historia puede desarrollarse con datos de incidentes reportados    |
| sin requerir el modelo de IA. Existe una dependencia funcional leve   |
| con el módulo ML (M-05) para precisar los scores, pero opera          |
| correctamente con los datos del sistema de reportes. El alcance está  |
| delimitado al renderizado del mapa y la visualización de scores, lo   |
| que permite estimarla de forma independiente en un sprint. Cumple     |
| INVEST: el principio I es parcial por la dependencia de datos de      |
| reportes, pero es técnicamente independiente.                         |
+-----------------------------------------------------------------------+
| **Justificación de story points**                                     |
|                                                                       |
| Implica integración de Mapbox GL JS (web) y React Native Maps         |
| (mobile), renderizado de capas de calor, actualización en tiempo real |
| via WebSockets (Socket.io) y lógica de cálculo de score por zona con  |
| PostGIS. Dos plataformas con comportamiento sincronizado sobre el     |
| mismo modelo de datos: 5 puntos.                                      |
+-----------------------------------------------------------------------+
| **Criterios de aceptación (Gherkin) --- IEEE 830 §3.6**               |
+-----------------------------------------------------------------------+
| **Feature: Visualización de zonas críticas**                          |
|                                                                       |
| **Scenario: El mapa carga con las 4 zonas críticas en menos de 3      |
| segundos**                                                            |
|                                                                       |
| > **Given** el usuario autenticado abre el módulo de mapa             |
| >                                                                     |
| > **When** el componente termina de renderizar                        |
| >                                                                     |
| > **Then** el mapa muestra las zonas: Ad Portas, Puente peatonal,     |
| > Puerta de madera y Entrada sur                                      |
| >                                                                     |
| > **And** el tiempo total de carga es inferior a 3 segundos           |
|                                                                       |
| **Scenario: Codificación semafórica correcta según score de riesgo**  |
|                                                                       |
| > **Given** el mapa está cargado                                      |
| >                                                                     |
| > **When** una zona tiene un score superior a 70                      |
| >                                                                     |
| > **Then** se muestra en color rojo                                   |
| >                                                                     |
| > **When** una zona tiene un score entre 40 y 70                      |
| >                                                                     |
| > **Then** se muestra en color ámbar                                  |
| >                                                                     |
| > **When** una zona tiene un score inferior a 40                      |
| >                                                                     |
| > **Then** se muestra en color verde                                  |
|                                                                       |
| **Scenario: El score se actualiza en tiempo real tras un nuevo        |
| reporte**                                                             |
|                                                                       |
| > **Given** el usuario tiene el mapa abierto                          |
| >                                                                     |
| > **When** otro usuario registra un incidente en una zona             |
| >                                                                     |
| > **Then** el score de esa zona se recalcula y actualiza en pantalla  |
| > en menos de 10 segundos                                             |
| >                                                                     |
| > **And** el cambio es visible sin recargar la página                 |
|                                                                       |
| **Scenario: El usuario consulta el detalle de una zona**              |
|                                                                       |
| > **Given** el mapa está cargado con las zonas visibles               |
| >                                                                     |
| > **When** el usuario selecciona una zona en el mapa                  |
| >                                                                     |
| > **Then** se despliega un panel con: incidentes recientes, hora del  |
| > último reporte y nivel de riesgo actual                             |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **HU-CU-03 --- Notificaciones push por proximidad --- Story Points: 3 |
| (Moderada)**                                                          |
+=======================================================================+
| **Actor:** Comunidad Universitaria (CU)                               |
+-----------------------------------------------------------------------+
| **Historia**                                                          |
|                                                                       |
| *Como miembro de la comunidad universitaria, quiero recibir una       |
| notificación push cuando se reporte un incidente dentro del radio de  |
| alerta que yo configure, para evitar zonas peligrosas y tomar         |
| precauciones oportunamente.*                                          |
+-----------------------------------------------------------------------+
| **Valor de negocio**                                                  |
|                                                                       |
| Reduce el tiempo entre la ocurrencia de un incidente y el             |
| conocimiento de los usuarios cercanos que podrían verse afectados,    |
| pasando de horas (canales informales) a menos de 30 segundos.         |
+-----------------------------------------------------------------------+
| **Estimabilidad e Independencia (INVEST)**                            |
|                                                                       |
| La historia es técnicamente independiente: la infraestructura push    |
| (APNs + FCM + Web Push VAPID) se implementa como servicio propio. En  |
| términos funcionales requiere que exista el sistema de reportes para  |
| generar notificaciones, pero puede desarrollarse y probarse con datos |
| simulados. El alcance está delimitado al envío, configuración de      |
| radio y gestión de preferencias. Principio I es parcial (dependencia  |
| funcional), todos los demás principios se cumplen plenamente.         |
+-----------------------------------------------------------------------+
| **Justificación de story points**                                     |
|                                                                       |
| La infraestructura push (APNs + FCM + VAPID) ya está contemplada en   |
| el stack y reutiliza la base del sistema de notificaciones. Esta      |
| historia añade la lógica de radio geográfico, cálculo de proximidad   |
| en PostGIS, y gestión de preferencias de usuario. Sin nuevas          |
| dependencias de infraestructura crítica: 3 puntos.                    |
+-----------------------------------------------------------------------+
| **Criterios de aceptación (Gherkin) --- IEEE 830 §3.6**               |
+-----------------------------------------------------------------------+
| **Feature: Notificaciones por proximidad**                            |
|                                                                       |
| **Scenario: Notificación enviada en menos de 30 segundos tras         |
| validación del reporte**                                              |
|                                                                       |
| > **Given** un reporte es validado por el sistema en la zona Ad       |
| > Portas                                                              |
| >                                                                     |
| > **And** existen usuarios con radio de alerta activo para esa zona   |
| >                                                                     |
| > **When** el sistema despacha las notificaciones                     |
| >                                                                     |
| > **Then** cada usuario afectado recibe la notificación en menos de   |
| > 30 segundos                                                         |
| >                                                                     |
| > **And** la notificación incluye: tipo de incidente, nombre de la    |
| > zona y score de riesgo actualizado                                  |
|                                                                       |
| **Scenario: El usuario configura su radio de alerta**                 |
|                                                                       |
| > **Given** el usuario está en la sección de preferencias de su       |
| > perfil                                                              |
| >                                                                     |
| > **When** selecciona un radio de alerta                              |
| >                                                                     |
| > **Then** puede elegir entre 200 m, 500 m o desactivado              |
| >                                                                     |
| > **And** el sistema aplica el nuevo radio inmediatamente sin         |
| > reiniciar la app                                                    |
|                                                                       |
| **Scenario: No se envían notificaciones nocturnas por defecto**       |
|                                                                       |
| > **Given** son las 01:30 am y el usuario no ha activado alertas      |
| > nocturnas                                                           |
| >                                                                     |
| > **When** se genera un incidente en una zona cercana al usuario      |
| >                                                                     |
| > **Then** el sistema no envía ninguna notificación push              |
|                                                                       |
| **Scenario: El usuario desactiva notificaciones sin desinstalar la    |
| app**                                                                 |
|                                                                       |
| > **Given** el usuario está en preferencias de notificaciones         |
| >                                                                     |
| > **When** desactiva todas las notificaciones de CampusShield         |
| >                                                                     |
| > **Then** el sistema deja de enviar push a ese dispositivo           |
| >                                                                     |
| > **And** el usuario mantiene acceso completo a la app                |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **HU-CU-04 --- Recomendación de rutas seguras con IA --- Story        |
| Points: 8 (Compleja)**                                                |
+=======================================================================+
| **Actor:** Comunidad Universitaria (CU)                               |
+-----------------------------------------------------------------------+
| **Historia**                                                          |
|                                                                       |
| *Como miembro de la comunidad universitaria, quiero recibir           |
| recomendaciones de rutas con menor nivel de riesgo según el horario   |
| en que voy a salir, para reducir mi exposición a zonas peligrosas sin |
| tener que interpretar el mapa por mi cuenta.*                         |
+-----------------------------------------------------------------------+
| **Valor de negocio**                                                  |
|                                                                       |
| Transforma el análisis geoespacial en una acción concreta y           |
| personalizada, reduciendo la carga cognitiva del usuario e            |
| incentivando el uso de rutas más seguras basadas en evidencia         |
| histórica y patrones de riesgo por franja horaria.                    |
+-----------------------------------------------------------------------+
| **Estimabilidad e Independencia (INVEST)**                            |
|                                                                       |
| La historia depende funcionalmente del microservicio ML (FastAPI +    |
| XGBoost) y de datos históricos reales, lo que representa una          |
| dependencia de desarrollo que debe considerarse en el sprint          |
| planning. El alcance está delimitado a la generación y visualización  |
| de rutas recomendadas. El principio I es parcial por la dependencia   |
| del modelo predictivo. Los demás principios INVEST se cumplen: el     |
| valor es claro, es estimable, cabe en un sprint de la Fase 3, y es    |
| testeable mediante los criterios Gherkin.                             |
+-----------------------------------------------------------------------+
| **Justificación de story points**                                     |
|                                                                       |
| Requiere el microservicio ML (FastAPI + XGBoost) funcional y          |
| entrenado con datos reales, lógica de comparación de rutas por score, |
| integración con el módulo de mapas y diseño de la interfaz de         |
| recomendación. Dependencia directa del modelo predictivo y de datos   |
| históricos de al menos 4 semanas: alta complejidad técnica y de datos |
| --- 8 puntos.                                                         |
+-----------------------------------------------------------------------+
| **Criterios de aceptación (Gherkin) --- IEEE 830 §3.6**               |
+-----------------------------------------------------------------------+
| **Feature: Recomendación de rutas seguras**                           |
|                                                                       |
| **Scenario: El sistema sugiere ruta alternativa cuando el riesgo es   |
| alto**                                                                |
|                                                                       |
| > **Given** el score de la ruta habitual del usuario supera 60        |
| >                                                                     |
| > **When** el usuario consulta el módulo de recomendaciones           |
| >                                                                     |
| > **Then** el sistema presenta al menos una ruta alternativa          |
| >                                                                     |
| > **And** muestra: ruta sugerida, tiempo adicional estimado en        |
| > minutos y reducción de riesgo en porcentaje                         |
|                                                                       |
| **Scenario: Las recomendaciones varían por franja horaria**           |
|                                                                       |
| > **Given** el usuario consulta rutas a las 21:00                     |
| >                                                                     |
| > **When** el mismo usuario consulta rutas a las 10:00 en el mismo    |
| > origen y destino                                                    |
| >                                                                     |
| > **Then** las recomendaciones de ruta son distintas para cada franja |
| > horaria                                                             |
| >                                                                     |
| > **And** el sistema indica la franja horaria aplicada: 6--12h,       |
| > 12--18h o 18--24h                                                   |
|                                                                       |
| **Scenario: El sistema alerta cuando todas las rutas presentan alto   |
| riesgo**                                                              |
|                                                                       |
| > **Given** todas las rutas disponibles tienen score superior a 70    |
| >                                                                     |
| > **When** el usuario solicita una recomendación                      |
| >                                                                     |
| > **Then** el sistema muestra el aviso: \"Todas las rutas presentan   |
| > riesgo elevado\"                                                    |
| >                                                                     |
| > **And** sugiere el horario histórico de menor riesgo para ese       |
| > trayecto                                                            |
|                                                                       |
| **Scenario: Las recomendaciones se generan en menos de 2 segundos**   |
|                                                                       |
| > **Given** el microservicio ML está operativo y el modelo cargado en |
| > memoria                                                             |
| >                                                                     |
| > **When** el usuario solicita una recomendación de ruta              |
| >                                                                     |
| > **Then** la respuesta aparece en pantalla en menos de 2 segundos    |
+-----------------------------------------------------------------------+

## **6.4 Historias de Usuario - Administrador de Seguridad**

+-----------------------------------------------------------------------+
| **HU-AD-01 --- Análisis predictivo de incidentes --- Story Points: 13 |
| (Muy Compleja)**                                                      |
+=======================================================================+
| **Actor:** Administrador de Seguridad (AD)                            |
+-----------------------------------------------------------------------+
| **Historia**                                                          |
|                                                                       |
| *Como administrador de seguridad, quiero que el sistema identifique   |
| automáticamente patrones de incidentes por zona y horario mediante    |
| inteligencia artificial, para anticipar zonas de riesgo y reasignar   |
| recursos de vigilancia de manera preventiva antes de que ocurra un    |
| incidente.*                                                           |
+-----------------------------------------------------------------------+
| **Valor de negocio**                                                  |
|                                                                       |
| Permite pasar de una gestión reactiva a una estrategia preventiva     |
| basada en evidencia histórica y análisis de datos, habilitando        |
| intervenciones antes de que los incidentes ocurran.                   |
+-----------------------------------------------------------------------+
| **Estimabilidad e Independencia (INVEST)**                            |
|                                                                       |
| La historia es técnicamente independiente para el administrador       |
| (panel de resultados separado), pero en términos de funcionalidad     |
| requiere datos del sistema de reportes para alimentar el análisis. Su |
| alcance está delimitado a la generación de predicciones, etiquetado   |
| de clústeres y visualización de resultados. Es candidata a            |
| subdivisión en sprint planning: HU-AD-01-a (modelo predictivo) y      |
| HU-AD-01-b (re-entrenamiento automático y alertas). Principio I       |
| parcial; todos los demás INVEST se cumplen.                           |
+-----------------------------------------------------------------------+
| **Justificación de story points**                                     |
|                                                                       |
| La historia de mayor complejidad del backlog. Requiere: modelo        |
| XGBoost entrenado y versionado, algoritmo DBSCAN para clustering      |
| geoespacial, microservicio FastAPI, pipeline de re-entrenamiento      |
| automatizado, integración con el panel en tiempo real y validación    |
| estadística de precisión. Múltiples dependencias técnicas y de datos: |
| 13 puntos. Candidata a subdivisión.                                   |
+-----------------------------------------------------------------------+
| **Criterios de aceptación (Gherkin) --- IEEE 830 §3.6**               |
+-----------------------------------------------------------------------+
| **Feature: Análisis predictivo de incidentes**                        |
|                                                                       |
| **Scenario: El modelo actualiza el score de riesgo por zona cada      |
| hora**                                                                |
|                                                                       |
| > **Given** el modelo predictivo está desplegado y operativo          |
| >                                                                     |
| > **When** transcurre una hora desde la última actualización          |
| >                                                                     |
| > **Then** el sistema recalcula el score de riesgo para cada zona     |
| >                                                                     |
| > **And** el nuevo score queda visible en el panel del administrador  |
|                                                                       |
| **Scenario: El sistema identifica y etiqueta clústeres de             |
| incidentes**                                                          |
|                                                                       |
| > **Given** existen al menos 3 incidentes en un radio de 200 m con    |
| > diferencia horaria máxima de 2 horas en los últimos 30 días         |
| >                                                                     |
| > **When** el algoritmo DBSCAN procesa el histórico de reportes       |
| >                                                                     |
| > **Then** el sistema crea un clúster etiquetado con: zona, franja    |
| > horaria crítica y conteo de incidentes                              |
| >                                                                     |
| > **And** el clúster queda visible en el panel del administrador con  |
| > nivel de confianza (%)                                              |
|                                                                       |
| **Scenario: Alerta automática al detectar patrón recurrente con       |
| confianza ≥ 70%**                                                     |
|                                                                       |
| > **Given** el modelo detecta un patrón recurrente en una zona y      |
| > franja horaria                                                      |
| >                                                                     |
| > **When** el nivel de confianza del modelo supera el 70%             |
| >                                                                     |
| > **Then** el sistema envía una alerta al administrador con: zona     |
| > afectada, horario crítico y porcentaje de confianza                 |
| >                                                                     |
| > **And** la alerta queda registrada en el historial de predicciones  |
| > del panel                                                           |
|                                                                       |
| **Scenario: El modelo se re-entrena automáticamente cada semana**     |
|                                                                       |
| > **Given** han transcurrido 7 días desde el último entrenamiento     |
| >                                                                     |
| > **When** el cron job de re-entrenamiento se ejecuta                 |
| >                                                                     |
| > **Then** el modelo incorpora los nuevos reportes de la semana       |
| >                                                                     |
| > **And** la versión anterior queda archivada para comparación        |
| > histórica                                                           |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **HU-AD-02 --- Panel de control en tiempo real --- Story Points: 5    |
| (Media)**                                                             |
+=======================================================================+
| **Actor:** Administrador de Seguridad (AD)                            |
+-----------------------------------------------------------------------+
| **Historia**                                                          |
|                                                                       |
| *Como administrador de seguridad, quiero visualizar todos los         |
| incidentes reportados en un panel centralizado que se actualice en    |
| tiempo real, para coordinar la respuesta institucional de manera      |
| eficiente sin depender de canales informales.*                        |
+-----------------------------------------------------------------------+
| **Valor de negocio**                                                  |
|                                                                       |
| Centraliza la información de seguridad en un único punto de control,  |
| reduciendo la dependencia de canales informales y mejorando la        |
| coordinación para la toma de decisiones con evidencia actualizada.    |
+-----------------------------------------------------------------------+
| **Estimabilidad e Independencia (INVEST)**                            |
|                                                                       |
| La historia es técnicamente independiente. En términos funcionales    |
| requiere datos del sistema de reportes, pero puede desarrollarse con  |
| datos simulados. El alcance está delimitado a la visualización en     |
| tiempo real, gestión de estados de incidentes y permisos              |
| diferenciados por rol. Todos los principios INVEST se cumplen; el     |
| principio I es parcial por dependencia funcional de datos.            |
+-----------------------------------------------------------------------+
| **Justificación de story points**                                     |
|                                                                       |
| Requiere implementación de WebSockets (Socket.io), lógica de estados  |
| de incidente con historial auditable, permisos diferenciados por rol  |
| (RBAC) y diseño del panel responsive. Sin dependencias de modelos ML: |
| complejidad técnica media --- 5 puntos.                               |
+-----------------------------------------------------------------------+
| **Criterios de aceptación (Gherkin) --- IEEE 830 §3.6**               |
+-----------------------------------------------------------------------+
| **Feature: Panel de incidentes en tiempo real**                       |
|                                                                       |
| **Scenario: Nuevo incidente aparece en el panel sin recargar la       |
| página**                                                              |
|                                                                       |
| > **Given** el administrador tiene el panel abierto en su navegador   |
| >                                                                     |
| > **When** un usuario registra un nuevo incidente en cualquier zona   |
| >                                                                     |
| > **Then** el incidente aparece en el panel en menos de 5 segundos    |
| > sin acción del administrador                                        |
| >                                                                     |
| > **And** el panel emite una señal visual indicando el nuevo evento   |
|                                                                       |
| **Scenario: Incidentes críticos se destacan con prioridad alta**      |
|                                                                       |
| > **Given** existe un incidente en una zona con score superior a 75   |
| >                                                                     |
| > **When** aparece en el panel                                        |
| >                                                                     |
| > **Then** se muestra con la etiqueta \"PRIORIDAD ALTA\"              |
| >                                                                     |
| > **And** queda posicionado al tope de la lista de incidentes activos |
|                                                                       |
| **Scenario: El administrador gestiona el estado de un incidente**     |
|                                                                       |
| > **Given** el administrador visualiza un incidente con estado        |
| > \"nuevo\"                                                           |
| >                                                                     |
| > **When** cambia el estado a \"en atención\" o \"cerrado\" y agrega  |
| > una nota                                                            |
| >                                                                     |
| > **Then** el cambio queda registrado con timestamp y nombre del      |
| > administrador que lo realizó                                        |
| >                                                                     |
| > **And** el historial de cambios es auditable desde el panel         |
|                                                                       |
| **Scenario: El panel es accesible desde navegador web sin             |
| instalación**                                                         |
|                                                                       |
| > **Given** el administrador accede desde un navegador web en         |
| > cualquier dispositivo                                               |
| >                                                                     |
| > **When** inicia sesión con credenciales institucionales             |
| >                                                                     |
| > **Then** accede al panel completo sin necesidad de instalar ninguna |
| > aplicación adicional                                                |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **HU-AD-03 --- Generación de reportes estadísticos exportables ---    |
| Story Points: 8 (Compleja)**                                          |
+=======================================================================+
| **Actor:** Administrador de Seguridad (AD)                            |
+-----------------------------------------------------------------------+
| **Historia**                                                          |
|                                                                       |
| *Como administrador de seguridad, quiero generar reportes             |
| estadísticos exportables en PDF y Excel con frecuencia, tipo y        |
| horario de incidentes por zona, para presentar evidencia objetiva a   |
| las directivas universitarias y al municipio de Chía y justificar     |
| intervenciones concretas.*                                            |
+-----------------------------------------------------------------------+
| **Valor de negocio**                                                  |
|                                                                       |
| Convierte los datos de la plataforma en evidencia formal para la toma |
| de decisiones institucionales, conectando CampusShield con la         |
| gobernanza de seguridad del municipio de Chía más allá del uso        |
| individual.                                                           |
+-----------------------------------------------------------------------+
| **Estimabilidad e Independencia (INVEST)**                            |
|                                                                       |
| La historia es independiente del módulo predictivo, aunque depende de |
| los datos del sistema de reportes para su funcionalidad completa. El  |
| alcance está delimitado a la generación de reportes con filtros,      |
| exportación en múltiples formatos y envío automático programado.      |
| Todos los principios INVEST se cumplen.                               |
+-----------------------------------------------------------------------+
| **Justificación de story points**                                     |
|                                                                       |
| Requiere generación de gráficas server-side (Matplotlib/Seaborn),     |
| exportación a PDF y Excel, integración con servicio de correo para    |
| envío automático programado (cron job), lógica de filtros combinados  |
| y validación de integridad de datos por periodo: 8 puntos.            |
+-----------------------------------------------------------------------+
| **Criterios de aceptación (Gherkin) --- IEEE 830 §3.6**               |
+-----------------------------------------------------------------------+
| **Feature: Generación de reportes estadísticos**                      |
|                                                                       |
| **Scenario: El reporte contiene todas las secciones requeridas**      |
|                                                                       |
| > **Given** el administrador solicita el reporte de la semana actual  |
| >                                                                     |
| > **When** el sistema genera el reporte                               |
| >                                                                     |
| > **Then** incluye: ranking de zonas por incidentes, distribución por |
| > tipo, mapa de calor semanal y comparación porcentual con la semana  |
| > anterior                                                            |
|                                                                       |
| **Scenario: El reporte se exporta en PDF y Excel con un clic en menos |
| de 10 segundos**                                                      |
|                                                                       |
| > **Given** el reporte está generado y visible en pantalla            |
| >                                                                     |
| > **When** el administrador hace clic en \"Exportar PDF\" o           |
| > \"Exportar Excel\"                                                  |
| >                                                                     |
| > **Then** el archivo se descarga en el dispositivo en menos de 10    |
| > segundos                                                            |
| >                                                                     |
| > **And** el archivo contiene exactamente los datos del periodo       |
| > visualizado                                                         |
|                                                                       |
| **Scenario: El sistema envía el reporte automáticamente cada lunes a  |
| las 8am**                                                             |
|                                                                       |
| > **Given** el administrador tiene registrado su correo institucional |
| > en el sistema                                                       |
| >                                                                     |
| > **When** son las 08:00 del lunes                                    |
| >                                                                     |
| > **Then** el sistema genera el reporte de la semana anterior y lo    |
| > envía al correo del administrador                                   |
| >                                                                     |
| > **And** el correo incluye el PDF adjunto y un resumen ejecutivo en  |
| > el cuerpo del mensaje                                               |
|                                                                       |
| **Scenario: El reporte respeta estrictamente el rango de fechas       |
| seleccionado**                                                        |
|                                                                       |
| > **Given** el administrador aplica un filtro de fechas específico    |
| >                                                                     |
| > **When** el sistema genera el reporte filtrado                      |
| >                                                                     |
| > **Then** todos los datos corresponden exclusivamente a ese rango    |
| >                                                                     |
| > **And** no aparece ningún incidente fuera de las fechas             |
| > seleccionadas                                                       |
+-----------------------------------------------------------------------+

## **6.5 Historias de Usuario -- Todos los Perfiles**

+-----------------------------------------------------------------------+
| **HU-SYS-01 --- Autenticación con correo institucional --- Story      |
| Points: 3 (Moderada)**                                                |
+=======================================================================+
| **Actor:** Todos los perfiles (Comunidad Universitaria, Personal      |
| Administrativo, Administrador de Seguridad)                           |
+-----------------------------------------------------------------------+
| **Historia**                                                          |
|                                                                       |
| *Como miembro de la comunidad de la Universidad de La Sabana, quiero  |
| iniciar sesión en CampusShield usando mi correo institucional         |
| (<@unisabana.edu.co>), para que el sistema verifique mi identidad y   |
| me asigne el perfil de acceso correspondiente a mi rol sin necesidad  |
| de registrarme manualmente.*                                          |
+-----------------------------------------------------------------------+
| **Valor de negocio**                                                  |
|                                                                       |
| Garantiza que únicamente personas con vínculo institucional           |
| verificado accedan a la plataforma, eliminando el riesgo de uso no    |
| autorizado y asignando automáticamente el nivel de acceso correcto    |
| (comunidad, personal administrativo o administrador de seguridad) sin |
| intervención manual del equipo de desarrollo.                         |
+-----------------------------------------------------------------------+
| **Estimabilidad e Independencia (INVEST)**                            |
|                                                                       |
| La historia es técnicamente independiente de los demás módulos        |
| funcionales: puede implementarse, desplegarse y probarse de forma     |
| aislada con un entorno de autenticación propio. Todos los demás       |
| módulos dependen funcionalmente de esta historia (requieren sesión    |
| activa), pero HU-SYS-01 no depende de ninguna otra. Cumple plenamente |
| los seis principios INVEST: es independiente, negociable en el        |
| mecanismo de OAuth (integración directa o propia), valiosa como       |
| puerta de entrada al sistema, estimable con alcance claro, cabe en un |
| sprint y es testeable mediante los criterios Gherkin.                 |
+-----------------------------------------------------------------------+
| **Justificación de story points**                                     |
|                                                                       |
| La historia requiere implementación del flujo de autenticación (JWT + |
| validación de dominio), middleware RBAC para asignación automática de |
| roles, lógica de bloqueo por intentos fallidos, refresco de token con |
| httpOnly cookie y mensajes de error que no revelen información        |
| sensible. No requiere modelos ML ni integraciones externas complejas: |
| flujo autenticado conocido y bien documentado --- 3 puntos.           |
+-----------------------------------------------------------------------+
| **Criterios de aceptación (Gherkin) --- IEEE 830 §3.6**               |
+-----------------------------------------------------------------------+
| **Feature: Autenticación institucional --- CampusShield**             |
|                                                                       |
| **Scenario: Login exitoso con correo institucional válido**           |
|                                                                       |
| > **Given** el usuario ingresa el correo                              |
| > <daniel.pareja@unisabana.edu.co> y su contraseña correcta           |
| >                                                                     |
| > **When** presiona el botón \"Iniciar sesión\"                       |
| >                                                                     |
| > **Then** el sistema valida las credenciales contra el dominio       |
| > \@unisabana.edu.co                                                  |
| >                                                                     |
| > **And** genera un JWT con el rol correspondiente al perfil del      |
| > usuario                                                             |
| >                                                                     |
| > **And** redirige al dashboard personalizado según ese rol           |
| >                                                                     |
| > **And** el login completo ocurre en menos de 3 segundos             |
|                                                                       |
| **Scenario: Acceso denegado con correo de dominio externo**           |
|                                                                       |
| > **Given** el usuario ingresa el correo <usuario@gmail.com>          |
| >                                                                     |
| > **When** presiona el botón \"Iniciar sesión\"                       |
| >                                                                     |
| > **Then** el sistema rechaza el intento                              |
| >                                                                     |
| > **And** muestra el mensaje: \"El acceso está restringido a la       |
| > comunidad UniSabana. Usa tu correo \@unisabana.edu.co\"             |
| >                                                                     |
| > **And** no se genera ningún token de sesión                         |
|                                                                       |
| **Scenario: Credenciales incorrectas muestran error sin revelar qué   |
| campo falló**                                                         |
|                                                                       |
| > **Given** el usuario ingresa credenciales incorrectas               |
| >                                                                     |
| > **When** presiona el botón \"Iniciar sesión\"                       |
| >                                                                     |
| > **Then** el sistema muestra el mensaje genérico: \"Correo o         |
| > contraseña incorrectos\"                                            |
| >                                                                     |
| > **And** no especifica si fue el correo o la contraseña el campo     |
| > erróneo                                                             |
| >                                                                     |
| > **And** registra el intento fallido en el log de auditoría          |
|                                                                       |
| **Scenario: Bloqueo temporal tras 5 intentos fallidos consecutivos**  |
|                                                                       |
| > **Given** el usuario ha fallado el inicio de sesión 5 veces         |
| > consecutivas                                                        |
| >                                                                     |
| > **When** intenta iniciar sesión por sexta vez                       |
| >                                                                     |
| > **Then** el sistema bloquea temporalmente el intento durante 15     |
| > minutos                                                             |
| >                                                                     |
| > **And** muestra el mensaje: \"Cuenta bloqueada temporalmente.       |
| > Intenta de nuevo en 15 minutos\"                                    |
| >                                                                     |
| > **And** envía un correo de aviso al correo institucional del        |
| > usuario                                                             |
|                                                                       |
| **Scenario: Sesión expira y redirige al login tras 24 horas**         |
|                                                                       |
| > **Given** el usuario tiene una sesión activa con JWT emitido hace   |
| > más de 24 horas                                                     |
| >                                                                     |
| > **When** realiza cualquier petición autenticada a la API            |
| >                                                                     |
| > **Then** el servidor responde con código 401 Unauthorized           |
| >                                                                     |
| > **And** el frontend redirige automáticamente al usuario a la        |
| > pantalla de login                                                   |
| >                                                                     |
| > **And** los datos del formulario en curso se conservan en sesión    |
| > local para no perder el trabajo                                     |
|                                                                       |
| **Scenario: El rol asignado corresponde al perfil institucional del   |
| usuario**                                                             |
|                                                                       |
| > **Given** el usuario autenticado tiene un cargo de Administrador de |
| > Seguridad en el sistema                                             |
| >                                                                     |
| > **When** el JWT es emitido tras el login exitoso                    |
| >                                                                     |
| > **Then** el payload del JWT contiene el campo role con el valor     |
| > \"security\"                                                        |
| >                                                                     |
| > **And** el dashboard que se carga corresponde al perfil de          |
| > Administrador de Seguridad                                          |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **HU-SYS-02 --- Story Points: 2 (Simple)**                            |
+=======================================================================+
| **Actor:** Todos los perfiles (Comunidad Universitaria, Personal      |
| Administrativo, Administrador de Seguridad)                           |
+-----------------------------------------------------------------------+
| **Historia**                                                          |
|                                                                       |
| *Como miembro de la comunidad de la Universidad de La Sabana que no   |
| habla español, quiero cambiar el idioma de la aplicación a inglés     |
| desde el menú de configuración, para poder usar todas las funciones   |
| de CampusShield sin que el idioma sea una barrera para mi seguridad.* |
+-----------------------------------------------------------------------+
| **Valor de negocio**                                                  |
|                                                                       |
| Garantiza que miembros internacionales de la comunidad universitaria  |
| --- estudiantes de intercambio, docentes y personal extranjero ---    |
| puedan acceder a todas las funcionalidades de seguridad de            |
| CampusShield en su idioma, eliminando la barrera lingüística en       |
| situaciones críticas donde la comprensión inmediata puede ser         |
| determinante.                                                         |
+-----------------------------------------------------------------------+
| **Estimabilidad e Independencia (INVEST)**                            |
|                                                                       |
| La historia es completamente independiente de todos los demás módulos |
| funcionales: no requiere datos de reportes, mapas, autenticación      |
| específica ni modelos ML. Puede implementarse, probarse y desplegarse |
| de forma aislada como un módulo de internacionalización (i18n) que    |
| envuelve la interfaz existente. Cumple plenamente los seis principios |
| INVEST, incluyendo el principio I de forma completa (es la única      |
| historia del backlog sin ninguna dependencia técnica ni funcional).   |
| El alcance está delimitado a dos idiomas con preferencia persistida   |
| en el perfil del usuario.                                             |
+-----------------------------------------------------------------------+
| **Justificación de story points**                                     |
|                                                                       |
| La historia requiere configurar una librería de internacionalización  |
| (react-i18next en web, expo-localization + i18n-js en mobile), crear  |
| los archivos de traducción para dos idiomas (/locales/es.json y       |
| /locales/en.json), envolver todos los strings de la interfaz con la   |
| función t() y persistir la preferencia en el perfil del usuario. Es   |
| trabajo de configuración y contenido más que de lógica compleja, sin  |
| dependencias de backend ni modelos predictivos. La complejidad        |
| técnica es baja y bien conocida: 2 puntos.                            |
+-----------------------------------------------------------------------+
| **Criterios de aceptación (Gherkin) --- IEEE 830 §3.6**               |
+-----------------------------------------------------------------------+
| **Feature: Language switch --- CampusShield i18n**                    |
|                                                                       |
| **Scenario: User switches app language to English successfully**      |
|                                                                       |
| > **Given** the authenticated user opens the Settings menu            |
| >                                                                     |
| > **When** they select "English" from the language options            |
| >                                                                     |
| > **Then** all interface labels, buttons and messages switch to       |
| > English in less than 500 ms                                         |
| >                                                                     |
| > **And** no page reload is required                                  |
| >                                                                     |
| > **And** the language preference is saved to the user profile        |
|                                                                       |
| **Scenario: Language preference persists across sessions**            |
|                                                                       |
| > **Given** the user has previously set their language preference to  |
| > English                                                             |
| >                                                                     |
| > **When** they log out and log back in                               |
| >                                                                     |
| > **Then** the application loads in English without requiring manual  |
| > selection again                                                     |
|                                                                       |
| **Scenario: Switching back to Spanish restores the original           |
| interface**                                                           |
|                                                                       |
| > **Given** the application is currently set to English               |
| >                                                                     |
| > **When** the user selects "Español" from the language options       |
| >                                                                     |
| > **Then** all interface labels, buttons and messages switch back to  |
| > Spanish in less than 500 ms                                         |
| >                                                                     |
| > **And** the updated preference is saved to the user profile         |
|                                                                       |
| **Scenario: Safety-critical content is correctly translated in        |
| English**                                                             |
|                                                                       |
| > **Given** the application is set to English                         |
| >                                                                     |
| > **When** the user navigates to the incident report module           |
| >                                                                     |
| > **Then** all incident type labels, confirmation messages and error  |
| > messages are displayed in English                                   |
| >                                                                     |
| > **And** no untranslated Spanish text is visible in any UI element   |
| > of that module                                                      |
|                                                                       |
| **Scenario: New user defaults to Spanish on first login**             |
|                                                                       |
| > **Given** a user logs into CampusShield for the first time          |
| >                                                                     |
| > **When** no language preference has been previously saved           |
| >                                                                     |
| > **Then** the application loads in Spanish by default                |
+-----------------------------------------------------------------------+

## **6.6 Validación de Historias --- Principios INVEST**

  ---------------------------------------------------------------------------
  **Historia**         **I**     **N**    **V**    **E**    **S**    **T**
  -------------------- --------- -------- -------- -------- -------- --------
  **HU-CU-01**         **✔**     **✔**    **✔**    **✔**    **✔**    **✔**

  **HU-CU-02**         **✔/✗**   **✔**    **✔**    **✔**    **✔**    **✔**

  **HU-CU-03**         **✔/✗**   **✔**    **✔**    **✔**    **✔**    **✔**

  **HU-CU-04**         **✔/✗**   **✔**    **✔**    **✔**    **✔**    **✔**

  **HU-AD-01**         **✔/✗**   **✔**    **✔**    **✔**    **✔**    **✔**

  **HU-AD-02**         **✔/✗**   **✔**    **✔**    **✔**    **✔**    **✔**

  **HU-AD-03**         **✔**     **✔**    **✔**    **✔**    **✔**    **✔**

  **HU-SYS-01**        **✔**     **✔**    **✔**    **✔**    **✔**    **✔**

  **HU-SYS-02**        **✔**     **✔**    **✔**    **✔**    **✔**    **✔**

  *✔ = Cumple                                                        
  plenamente ✔/✗ =                                                   
  Cumple con                                                         
  dependencia                                                        
  funcional de datos                                                 
  (técnicamente                                                      
  independiente) ✗ =                                                 
  No cumple*                                                         
  ---------------------------------------------------------------------------

## **6.7 Resumen del Backlog**

  ------------------------------------------------------------------------
  **Perfil**                           **Historias**     **Story Points**
  ------------------------------------ ----------------- -----------------
  Comunidad Universitaria              4                 21

  Administrador de Seguridad           3                 26

  Todos los perfiles                   2                 5

  **Total**                            **9**             **52**
  ------------------------------------------------------------------------

# **7. Requisitos Funcionales --- IEEE 830**

Los requisitos funcionales se especifican siguiendo el estándar IEEE 830
(Software Requirements Specification), que exige que cada requerimiento
sea específico, no ambiguo, verificable y trazable a una historia de
usuario del backlog. Cada requerimiento incluye prioridad de
implementación (Alta / Media / Baja) y restricciones de diseño
pertinentes.

## **7.1 Escala de prioridad IEEE 830**

  -----------------------------------------------------------------------------
  **Prioridad**   **Definición IEEE 830**        **Criterio en CampusShield**
  --------------- ------------------------------ ------------------------------
  **Alta**        Esencial para que el sistema   Requerido en el MVP (Fase 1).
                  cumpla su propósito mínimo.    Sin él el sistema no puede
                                                 operar.

  **Media**       Importante pero no bloquea la  Requerido en Fase 2 o 3.
                  operación básica.              Aumenta el valor
                                                 significativamente.

  **Baja**        Deseable. Puede diferirse sin  Backlog para versiones futuras
                  impactar la funcionalidad      o escalamiento al municipio de
                  central.                       Chía.
  -----------------------------------------------------------------------------

## **7.2 Trazabilidad RF -0 Historias de Usuario**

  -------------------------------------------------------------------------------------
  **ID RF**       **Historia    **Actor**       **Prioridad**   **Objetivo**
                  asociada**                                    
  --------------- ------------- --------------- --------------- -----------------------
  **RF-M03-01**   HU-CU-01      Comunidad       **Alta**        Registrar incidentes
                                                                con GPS en ≤ 3 pasos

  **RF-M03-02**   HU-CU-01      Comunidad       **Alta**        Modo anónimo sin
                                                                almacenar identidad

  **RF-M02-01**   HU-CU-02      Comunidad       **Alta**        Mapa de calor con
                                                                scores en tiempo real

  **RF-M01-01**   HU-CU-01 /    Todos           **Alta**        Dashboard personalizado
                  HU-AD-02                                      por perfil de usuario

  **RF-SYS-01**   Todas         Todos           **Alta**        Autenticación con
                                                                correo institucional
                                                                UniSabana

  **RF-SYS-02**   HU-SYS-02     Todos           **Media**       Permite cambiar el
                                                                idioma a inglés.

  **RF-SYS-03**   HU-CU-03      Todos           **Alta**        Notificaciones push web
                                                                y mobile

  **RF-M04-01**   HU-CU-03      Comunidad       **Media**       Avistamientos
                                                                comunitarios con
                                                                validación cruzada

  **RF-M02-02**   HU-CU-03      Comunidad       **Media**       Geofencing de alertas
                                                                por proximidad
                                                                configurable

  **RF-M06-01**   HU-AD-02      Administrador   **Media**       Panel de incidentes en
                                                                tiempo real
                                                                (WebSockets)

  **RF-M05-01**   HU-CU-04      Comunidad       **Media**       Recomendaciones de ruta
                                                                con modelo predictivo

  **RF-M05-02**   HU-AD-01      Administrador   **Baja**        Clustering automático
                                                                de patrones (DBSCAN)

  **RF-M06-02**   HU-AD-03      Administrador   **Baja**        Exportación de reportes
                                                                estadísticos PDF/Excel
  -------------------------------------------------------------------------------------

## **7.3 Lista de Requisitos Funcionales**

+-----------------------------------------------------------------------+
| **RF-SYS-01-A --- SYS --- Autenticación transversal**                 |
+=======================================================================+
| **Actor:** Todos los perfiles **Historia asociada:** HU-SYS-01        |
| **Prioridad (IEEE 830): Alta**                                        |
+-----------------------------------------------------------------------+
| **Descripción**                                                       |
|                                                                       |
| El sistema debe permitir el inicio de sesión exclusivamente a         |
| usuarios con correo del dominio \@unisabana.edu.co. Tras la           |
| validación exitosa de credenciales, debe emitir un JSON Web Token     |
| (JWT) firmado que contenga el identificador del usuario, su rol y la  |
| fecha de expiración (24 horas). El proceso completo de autenticación  |
| debe completarse en menos de 3 segundos.                              |
+-----------------------------------------------------------------------+
| **Entradas:** Correo electrónico institucional (<@unisabana.edu.co>), |
| contraseña                                                            |
|                                                                       |
| **Salidas:** JWT firmado con payload {user_id, role, exp},            |
| redirección al dashboard correspondiente al rol                       |
+-----------------------------------------------------------------------+
| **Flujo principal**                                                   |
|                                                                       |
| 1.  El usuario ingresa su correo institucional y contraseña           |
|                                                                       |
| 2.  El sistema valida que el dominio del correo sea                   |
|     \@unisabana.edu.co                                                |
|                                                                       |
| 3.  El sistema verifica las credenciales contra la base de datos      |
|     (contraseña hasheada con bcrypt)                                  |
|                                                                       |
| 4.  El sistema emite un JWT firmado con los campos user_id, role y    |
|     exp (24h)                                                         |
|                                                                       |
| 5.  El sistema emite un refresh token con vigencia de 7 días en       |
|     httpOnly cookie                                                   |
|                                                                       |
| 6.  El frontend redirige al dashboard personalizado según el rol del  |
|     JWT                                                               |
+-----------------------------------------------------------------------+
| **Flujos alternativos**                                               |
|                                                                       |
| -   Correo válido pero contraseña incorrecta: se muestra mensaje      |
|     genérico sin indicar qué campo falló                              |
|                                                                       |
| -   Sesión expirada: el sistema intenta renovar con el refresh token  |
|     antes de redirigir al login                                       |
|                                                                       |
| **Excepciones**                                                       |
|                                                                       |
| -   Dominio de correo no es \@unisabana.edu.co: el sistema rechaza el |
|     intento con mensaje específico de dominio                         |
|                                                                       |
| -   Servicio de autenticación no disponible: el sistema muestra       |
|     mensaje de error genérico y registra el fallo                     |
|                                                                       |
| -   Refresh token expirado o inválido: el sistema redirige al login y |
|     limpia las cookies de sesión                                      |
+-----------------------------------------------------------------------+
| **Criterios de aceptación (IEEE 830 §3.4)**                           |
|                                                                       |
| -   El 100% de los accesos con correo de dominio externo son          |
|     rechazados                                                        |
|                                                                       |
| -   El JWT se emite en menos de 3 segundos desde el envío del         |
|     formulario en el P95                                              |
|                                                                       |
| -   El JWT contiene siempre los campos user_id, role y exp con        |
|     valores correctos                                                 |
|                                                                       |
| -   El refresh token se almacena exclusivamente en httpOnly cookie    |
|     (no accesible por JavaScript)                                     |
+-----------------------------------------------------------------------+
| **Verificación Gherkin**                                              |
+-----------------------------------------------------------------------+
| **Feature: RF-SYS-01-A · Autenticación con JWT**                      |
|                                                                       |
| **Scenario: Login exitoso emite JWT con rol correcto en menos de 3    |
| segundos**                                                            |
|                                                                       |
| > **Given** el usuario ingresa el correo                              |
| > <daniel.pareja@unisabana.edu.co> y su contraseña correcta           |
| >                                                                     |
| > **When** presiona \"Iniciar sesión\"                                |
| >                                                                     |
| > **Then** el sistema emite un JWT con campo role igual al perfil     |
| > institucional del usuario                                           |
| >                                                                     |
| > **And** el proceso completo ocurre en menos de 3 segundos           |
| >                                                                     |
| > **And** el frontend redirige al dashboard del rol correspondiente   |
|                                                                       |
| **Scenario: Rechazo de correo con dominio externo**                   |
|                                                                       |
| > **Given** el usuario ingresa el correo <externo@gmail.com>          |
| >                                                                     |
| > **When** presiona \"Iniciar sesión\"                                |
| >                                                                     |
| > **Then** el sistema responde con código 401                         |
| >                                                                     |
| > **And** el mensaje es: \"El acceso está restringido a la comunidad  |
| > UniSabana. Usa tu correo \@unisabana.edu.co\"                       |
| >                                                                     |
| > **And** no se emite ningún token                                    |
|                                                                       |
| **Scenario: Refresco automático de sesión con refresh token válido**  |
|                                                                       |
| > **Given** el JWT del usuario ha expirado                            |
| >                                                                     |
| > **And** el refresh token almacenado en httpOnly cookie es válido    |
| >                                                                     |
| > **When** el usuario realiza una petición autenticada                |
| >                                                                     |
| > **Then** el sistema emite un nuevo JWT sin requerir login manual    |
| >                                                                     |
| > **And** la petición original se completa con éxito                  |
+-----------------------------------------------------------------------+
| **Trazabilidad:** HU-SYS-01 · RF-SYS-01-B · RNF-SEG-01 · RNF-SEG-02 · |
| RNF-AUTH-01 · RNF-AUTH-02                                             |
|                                                                       |
| **Restricción de diseño (IEEE 830 §3.5):** Implementar con            |
| jsonwebtoken (Node.js). El JWT se firma con clave RS256 (par de       |
| claves asimétricas). El refresh token se almacena en httpOnly cookie  |
| con SameSite=Strict. La clave privada de firma se almacena como       |
| variable de entorno, nunca en el repositorio.                         |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **RF-SYS-01-B --- SYS --- Autenticación transversal**                 |
+=======================================================================+
| **Actor:** Todos los perfiles **Historia asociada:** HU-SYS-01        |
| **Prioridad (IEEE 830): Alta**                                        |
+-----------------------------------------------------------------------+
| **Descripción**                                                       |
|                                                                       |
| El sistema debe registrar los intentos fallidos de inicio de sesión   |
| por usuario. Tras 5 intentos fallidos consecutivos en un periodo de   |
| 15 minutos, debe bloquear temporalmente la cuenta durante 15 minutos  |
| y notificar al usuario mediante un correo al correo institucional     |
| registrado. Los mensajes de error nunca deben especificar si el error |
| fue en el correo o en la contraseña.                                  |
+-----------------------------------------------------------------------+
| **Entradas:** Correo institucional, contraseña incorrecta, contador   |
| de intentos fallidos por usuario y ventana de tiempo                  |
|                                                                       |
| **Salidas:** Bloqueo temporal, correo de notificación de actividad    |
| sospechosa, mensaje de error genérico en pantalla                     |
+-----------------------------------------------------------------------+
| **Flujo principal**                                                   |
|                                                                       |
| 1.  El usuario ingresa credenciales incorrectas                       |
|                                                                       |
| 2.  El sistema incrementa el contador de intentos fallidos para ese   |
|     correo                                                            |
|                                                                       |
| 3.  El sistema muestra el mensaje genérico: «Correo o contraseña      |
|     incorrectos»                                                      |
|                                                                       |
| 4.  Al alcanzar 5 intentos fallidos en 15 minutos, el sistema bloquea |
|     la cuenta temporalmente                                           |
|                                                                       |
| 5.  El sistema envía un correo de notificación al correo              |
|     institucional del usuario afectado                                |
|                                                                       |
| 6.  El sistema muestra el mensaje: «Cuenta bloqueada temporalmente.   |
|     Intenta de nuevo en 15 minutos»                                   |
+-----------------------------------------------------------------------+
| **Flujos alternativos**                                               |
|                                                                       |
| -   El contador se reinicia automáticamente tras un login exitoso     |
|                                                                       |
| -   El administrador del sistema puede desbloquear manualmente una    |
|     cuenta desde el panel de gestión                                  |
|                                                                       |
| **Excepciones**                                                       |
|                                                                       |
| -   Correo institucional no registrado en el sistema: el sistema      |
|     muestra el mismo mensaje genérico sin confirmar si el correo      |
|     existe (prevención de enumeración de usuarios)                    |
|                                                                       |
| -   Servicio de correo no disponible al intentar enviar la            |
|     notificación: el sistema registra el fallo en log de auditoría y  |
|     bloquea igualmente la cuenta                                      |
+-----------------------------------------------------------------------+
| **Criterios de aceptación (IEEE 830 §3.4)**                           |
|                                                                       |
| -   Tras 5 intentos fallidos consecutivos el acceso queda bloqueado   |
|     en el 100% de los casos                                           |
|                                                                       |
| -   El mensaje de error es siempre genérico, sin especificar el campo |
|     incorrecto, en el 100% de los intentos fallidos                   |
|                                                                       |
| -   El correo de notificación se envía en menos de 60 segundos tras   |
|     el bloqueo                                                        |
|                                                                       |
| -   El bloqueo se levanta automáticamente a los 15 minutos sin        |
|     intervención manual                                               |
+-----------------------------------------------------------------------+
| **Verificación Gherkin**                                              |
+-----------------------------------------------------------------------+
| **Feature: RF-SYS-01-B · Bloqueo por intentos fallidos**              |
|                                                                       |
| **Scenario: Mensaje de error genérico no revela qué campo falló**     |
|                                                                       |
| > **Given** el usuario ingresa credenciales incorrectas               |
| >                                                                     |
| > **When** el sistema procesa el intento fallido                      |
| >                                                                     |
| > **Then** el mensaje mostrado es únicamente: \"Correo o contraseña   |
| > incorrectos\"                                                       |
| >                                                                     |
| > **And** el mensaje no especifica si el error fue en el correo o en  |
| > la contraseña                                                       |
|                                                                       |
| **Scenario: Bloqueo temporal tras 5 intentos fallidos consecutivos**  |
|                                                                       |
| > **Given** el usuario ha fallado el inicio de sesión 5 veces         |
| > consecutivas en menos de 15 minutos                                 |
| >                                                                     |
| > **When** intenta iniciar sesión por sexta vez                       |
| >                                                                     |
| > **Then** el sistema bloquea el acceso durante 15 minutos            |
| >                                                                     |
| > **And** muestra el mensaje: \"Cuenta bloqueada temporalmente.       |
| > Intenta de nuevo en 15 minutos\"                                    |
| >                                                                     |
| > **And** envía un correo de aviso al correo institucional del        |
| > usuario en menos de 60 segundos                                     |
|                                                                       |
| **Scenario: Correo inexistente no revela si el usuario está           |
| registrado**                                                          |
|                                                                       |
| > **Given** el usuario ingresa un correo institucional no registrado  |
| > en el sistema                                                       |
| >                                                                     |
| > **When** presiona \"Iniciar sesión\"                                |
| >                                                                     |
| > **Then** el sistema muestra el mismo mensaje genérico: \"Correo o   |
| > contraseña incorrectos\"                                            |
| >                                                                     |
| > **And** no confirma ni deniega la existencia del correo en el       |
| > sistema                                                             |
+-----------------------------------------------------------------------+
| **Trazabilidad:** HU-SYS-01 · RF-SYS-01-A · RNF-SEG-01 · RNF-AUTH-02  |
| · RNF-AUTH-03                                                         |
|                                                                       |
| **Restricción de diseño (IEEE 830 §3.5):** El contador de intentos    |
| fallidos se almacena en Redis con TTL de 15 minutos por clave         |
| {email}:failed_attempts. El correo de notificación se envía via       |
| Resend con plantilla institucional. La lógica de bloqueo se aplica en |
| el middleware de autenticación antes de consultar la base de datos.   |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **RF-SYS-01-C --- SYS --- Autenticación transversal**                 |
+=======================================================================+
| **Actor:** Todos los perfiles **Historia asociada:** HU-SYS-01        |
| **Prioridad (IEEE 830): Alta**                                        |
+-----------------------------------------------------------------------+
| **Descripción**                                                       |
|                                                                       |
| El sistema debe asignar automáticamente el rol de acceso (community / |
| admin / security) al usuario en el momento del registro o del primer  |
| inicio de sesión, basándose en su perfil institucional. El rol        |
| determina las vistas, endpoints y funcionalidades disponibles en toda |
| la plataforma. El cambio de rol debe ser posible únicamente desde el  |
| panel de administración del sistema.                                  |
+-----------------------------------------------------------------------+
| **Entradas:** Correo institucional con dominio validado, perfil       |
| institucional del usuario en la base de datos                         |
|                                                                       |
| **Salidas:** Rol asignado en el JWT (community \| admin \| security), |
| dashboard cargado según ese rol                                       |
+-----------------------------------------------------------------------+
| **Flujo principal**                                                   |
|                                                                       |
| 1.  El usuario inicia sesión por primera vez o el sistema registra su |
|     correo institucional                                              |
|                                                                       |
| 2.  El sistema consulta el perfil institucional en la tabla de        |
|     usuarios                                                          |
|                                                                       |
| 3.  El sistema asigna el rol correspondiente: community (estudiantes  |
|     y docentes), admin (personal administrativo), security (equipo de |
|     seguridad)                                                        |
|                                                                       |
| 4.  El rol queda almacenado en la base de datos y se incluye en el    |
|     payload del JWT en cada sesión                                    |
|                                                                       |
| 5.  El frontend carga las rutas, vistas y módulos correspondientes al |
|     rol asignado                                                      |
+-----------------------------------------------------------------------+
| **Flujos alternativos**                                               |
|                                                                       |
| -   Usuario con múltiples roles institucionales: el sistema asigna el |
|     rol de mayor privilegio y permite al administrador ajustarlo      |
|     manualmente                                                       |
|                                                                       |
| **Excepciones**                                                       |
|                                                                       |
| -   Perfil institucional no encontrado para el correo registrado: el  |
|     sistema asigna el rol community por defecto y registra el caso en |
|     el log de auditoría para revisión manual                          |
|                                                                       |
| -   Intento de modificar el rol desde el cliente (manipulación del    |
|     JWT): el servidor rechaza el token con código 401 y registra el   |
|     intento                                                           |
+-----------------------------------------------------------------------+
| **Criterios de aceptación (IEEE 830 §3.4)**                           |
|                                                                       |
| -   El rol asignado en el JWT coincide con el perfil institucional    |
|     del usuario en el 100% de los logins exitosos                     |
|                                                                       |
| -   Un usuario con rol community no puede acceder a endpoints de      |
|     admin o security en ningún caso                                   |
|                                                                       |
| -   El cambio de rol es posible únicamente desde el panel de          |
|     administración con credenciales de administrador del sistema      |
+-----------------------------------------------------------------------+
| **Verificación Gherkin**                                              |
+-----------------------------------------------------------------------+
| **Feature: RF-SYS-01-C · Asignación de rol**                          |
|                                                                       |
| **Scenario: El JWT contiene el rol correcto según el perfil           |
| institucional**                                                       |
|                                                                       |
| > **Given** el usuario tiene el cargo de Administrador de Seguridad   |
| > en la base de datos                                                 |
| >                                                                     |
| > **When** inicia sesión exitosamente                                 |
| >                                                                     |
| > **Then** el payload del JWT contiene role: \"security\"             |
| >                                                                     |
| > **And** el dashboard que se carga corresponde al perfil de          |
| > Administrador de Seguridad                                          |
| >                                                                     |
| > **And** los endpoints de administración están disponibles para este |
| > usuario                                                             |
|                                                                       |
| **Scenario: Manipulación del JWT es detectada y rechazada**           |
|                                                                       |
| > **Given** un usuario con rol community manipula su JWT para cambiar |
| > el rol a security                                                   |
| >                                                                     |
| > **When** envía una petición con el JWT manipulado al endpoint GET   |
| > /api/admin/incidents                                                |
| >                                                                     |
| > **Then** el servidor detecta que la firma del JWT no es válida      |
| >                                                                     |
| > **And** responde con código 401 Unauthorized                        |
| >                                                                     |
| > **And** registra el intento en el log de auditoría de seguridad     |
+-----------------------------------------------------------------------+
| **Trazabilidad:** HU-SYS-01 · RF-SYS-01-A · RNF-SEG-02 · RNF-AUTH-01  |
|                                                                       |
| **Restricción de diseño (IEEE 830 §3.5):** Los roles se almacenan en  |
| la tabla users con columna role ENUM(community, admin, security). La  |
| firma del JWT usa RS256 --- el servidor valida la firma con la clave  |
| pública en cada petición. Cualquier JWT con firma inválida o payload  |
| modificado es rechazado con 401 sin revelar el motivo específico del  |
| rechazo.                                                              |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **RF-SYS-02 --- SYS --- Internacionalización (i18n)**                 |
+=======================================================================+
| **Actor:** Todos los perfiles **Historia:** HU-SYS-02 **Prioridad     |
| (IEEE 830): Media**                                                   |
+-----------------------------------------------------------------------+
| **Descripción**                                                       |
|                                                                       |
| El sistema debe permitir al usuario autenticado cambiar el idioma de  |
| la interfaz entre español e inglés desde el menú de configuración de  |
| su perfil. El cambio debe aplicarse de forma inmediata en toda la     |
| interfaz sin recargar la página o la app, y la preferencia debe       |
| persistir en el perfil del usuario para mantenerse en sesiones        |
| futuras. El idioma por defecto para usuarios sin preferencia guardada |
| debe ser español.                                                     |
+-----------------------------------------------------------------------+
| **Entradas:** Idioma seleccionado (es \| en), preferencia almacenada  |
| en el perfil del usuario **Salidas:** Interfaz completamente          |
| traducida al idioma seleccionado, preferencia persistida en base de   |
| datos                                                                 |
+-----------------------------------------------------------------------+
| **Flujo principal**                                                   |
|                                                                       |
| 1.  El usuario abre el menú de configuración de su perfil             |
|                                                                       |
| 2.  Selecciona el idioma deseado (Español o English)                  |
|                                                                       |
| 3.  El sistema aplica el cambio de idioma de forma inmediata en toda  |
|     la interfaz en menos de 500 ms                                    |
|                                                                       |
| 4.  El sistema guarda la preferencia en el perfil del usuario en la   |
|     base de datos                                                     |
|                                                                       |
| 5.  En sesiones futuras, la app carga directamente en el idioma       |
|     guardado                                                          |
+-----------------------------------------------------------------------+
| **Flujos alternativos**                                               |
|                                                                       |
| -   Usuario sin preferencia guardada: el sistema carga en español por |
|     defecto                                                           |
|                                                                       |
| -   El idioma puede cambiarse también desde la pantalla de login      |
|     antes de autenticarse                                             |
|                                                                       |
| **Excepciones**                                                       |
|                                                                       |
| -   Archivo de traducción no disponible: el sistema mantiene el       |
|     idioma actual y muestra un aviso no crítico                       |
|                                                                       |
| -   Error al guardar preferencia por pérdida de conexión: el cambio   |
|     se aplica en la sesión actual y se reintenta al recuperar red     |
+-----------------------------------------------------------------------+
| **Criterios de aceptación (IEEE 830 §3.4)**                           |
|                                                                       |
| -   El cambio de idioma se aplica en todos los elementos de la        |
|     interfaz en menos de 500 ms sin recargar en el 100% de los casos  |
|                                                                       |
| -   La preferencia de idioma persiste correctamente tras cerrar       |
|     sesión y volver a iniciarla                                       |
|                                                                       |
| -   0 cadenas de texto sin traducir visibles en la interfaz tras      |
|     aplicar el cambio en el 100% de las vistas principales            |
|                                                                       |
| -   El idioma por defecto es español en el 100% de los primeros       |
|     logins sin preferencia guardada                                   |
+-----------------------------------------------------------------------+
| **Verificación Gherkin**                                              |
+-----------------------------------------------------------------------+
| **Feature: RF-SYS-02 · Internacionalización i18n**                    |
|                                                                       |
| **Scenario: Language change applies to all UI elements in less than   |
| 500 ms**                                                              |
|                                                                       |
| > **Given** the authenticated user is on the Settings page            |
| >                                                                     |
| > **When** they select "English" from the language selector           |
| >                                                                     |
| > **Then** all UI labels, buttons and messages switch to English in   |
| > less than 500 ms                                                    |
| >                                                                     |
| > **And** no page reload occurs                                       |
|                                                                       |
| **Scenario: No untranslated text visible after language switch**      |
|                                                                       |
| > **Given** the user has switched the language to English             |
| >                                                                     |
| > **When** they navigate through all main views of the application    |
| >                                                                     |
| > **Then** no Spanish text is visible in any UI element across all    |
| > views                                                               |
|                                                                       |
| **Scenario: Default language is Spanish for new users**               |
|                                                                       |
| > **Given** a user logs in for the first time with no saved language  |
| > preference                                                          |
| >                                                                     |
| > **When** the application loads                                      |
| >                                                                     |
| > **Then** the interface is displayed entirely in Spanish             |
|                                                                       |
| **Scenario: Language preference persists after logout and login**     |
|                                                                       |
| > **Given** the user has set English as their preferred language      |
| >                                                                     |
| > **When** they log out and log back in                               |
| >                                                                     |
| > **Then** the application loads directly in English                  |
| >                                                                     |
| > **And** no language selection is required                           |
+-----------------------------------------------------------------------+
| **Trazabilidad:** HU-SYS-02 · RF-SYS-01-A (perfil de usuario) ·       |
| RNF-I18N-01                                                           |
|                                                                       |
| **Restricción de diseño (IEEE 830 §3.5):** Web: react-i18next con     |
| archivos /locales/es.json y /locales/en.json en el paquete shared del |
| monorepo. Mobile: expo-localization + i18n-js. Todos los strings de   |
| la interfaz deben envolverse con la función t() antes del despliegue  |
| de la Fase 1. La preferencia se almacena en la columna language_pref  |
| de la tabla users con valores ENUM(es, en).                           |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **RF-M03-01 --- Registro de incidentes con GPS en 3 pasos --- M03 --- |
| Reporte de incidentes**                                               |
+=======================================================================+
| **Actor:** Comunidad Universitaria **Historia asociada:** HU-CU-01    |
| **Prioridad (IEEE 830): Alta**                                        |
+-----------------------------------------------------------------------+
| **Descripción**                                                       |
|                                                                       |
| El sistema debe permitir al usuario registrar un incidente de         |
| seguridad completando un flujo máximo de tres pasos: selección del    |
| tipo de incidente, captura automática de ubicación GPS y confirmación |
| de envío. El reporte debe quedar persistido con timestamp y           |
| coordenadas en menos de cinco segundos tras la confirmación.          |
+-----------------------------------------------------------------------+
| **Entradas:** Tipo de incidente, ubicación GPS automática,            |
| descripción opcional, foto opcional                                   |
|                                                                       |
| **Salidas:** Número de caso único, timestamp, coordenadas, estado     |
| inicial \"nuevo\"                                                     |
+-----------------------------------------------------------------------+
| **Flujo principal**                                                   |
|                                                                       |
| 1.  El usuario accede al módulo de reporte                            |
|                                                                       |
| 2.  Selecciona el tipo de incidente (paso 1)                          |
|                                                                       |
| 3.  El sistema captura la ubicación GPS automáticamente (paso 2)      |
|                                                                       |
| 4.  El usuario confirma y envía (paso 3)                              |
|                                                                       |
| 5.  El sistema persiste el reporte y genera un ID único               |
+-----------------------------------------------------------------------+
| **Flujos alternativos**                                               |
|                                                                       |
| -   Modo anónimo: el sistema no almacena la identidad del usuario     |
|     junto al reporte                                                  |
|                                                                       |
| -   Modo sin conexión: el reporte se encola localmente y se           |
|     sincroniza al recuperar red                                       |
|                                                                       |
| -   GPS no disponible: el usuario puede seleccionar la zona           |
|     manualmente en el mapa                                            |
|                                                                       |
| **Excepciones**                                                       |
|                                                                       |
| -   GPS no disponible y los usuarios no seleccionan la zona: el       |
|     sistema muestra mensaje de error descriptivo                      |
|                                                                       |
| -   Pérdida de sesión durante el flujo: el sistema conserva los datos |
|     del formulario                                                    |
+-----------------------------------------------------------------------+
| **Criterios de aceptación (IEEE 830 §3.4)**                           |
|                                                                       |
| -   El 95% de los reportes se registran en menos de 5 segundos tras   |
|     la confirmación                                                   |
|                                                                       |
| -   El ID de caso es único y se genera en el 100% de los envíos       |
|     exitosos                                                          |
|                                                                       |
| -   El modo anónimo no almacena ningún dato de identidad del usuario  |
+-----------------------------------------------------------------------+
| **Verificación Gherkin**                                              |
+-----------------------------------------------------------------------+
| **Feature: RF-M03-01 · Registro de incidentes**                       |
|                                                                       |
| **Scenario: Flujo completo en exactamente 3 pasos**                   |
|                                                                       |
| > **Given** el usuario autenticado abre el módulo de reporte          |
| >                                                                     |
| > **When** inicia el proceso de reporte                               |
| >                                                                     |
| > **Then** el sistema presenta el paso 1: selección de tipo de        |
| > incidente                                                           |
| >                                                                     |
| > **And** el paso 2: confirmación de ubicación GPS automática         |
| >                                                                     |
| > **And** el paso 3: confirmación y envío                             |
| >                                                                     |
| > **And** no existe ningún paso adicional obligatorio                 |
|                                                                       |
| **Scenario: Registro en base de datos en menos de 5 segundos**        |
|                                                                       |
| > **Given** el usuario completa el paso 3 y presiona \"Enviar\"       |
| >                                                                     |
| > **When** el sistema procesa el reporte                              |
| >                                                                     |
| > **Then** el reporte queda persistido con timestamp y coordenadas en |
| > menos de 5 segundos                                                 |
| >                                                                     |
| > **And** el usuario recibe confirmación visual con número de caso    |
| > único                                                               |
|                                                                       |
| **Scenario: Cola offline con sincronización automática**              |
|                                                                       |
| > **Given** el dispositivo no tiene conexión al enviar                |
| >                                                                     |
| > **When** el usuario completa el reporte                             |
| >                                                                     |
| > **Then** el sistema almacena el reporte en cola local               |
| >                                                                     |
| > **And** lo sincroniza automáticamente al recuperar conectividad     |
+-----------------------------------------------------------------------+
| **Trazabilidad:** HU-CU-01 · RF-M03-02 · RF-SYS-01 · RF-SYS-02        |
|                                                                       |
| **Restricción de diseño (IEEE 830 §3.5):** La captura GPS usa         |
| expo-location (mobile) o Geolocation API (web). Tiempo máximo de      |
| espera para GPS: 10 segundos antes de activar selección manual. La    |
| disociación de identidad en modo anónimo se realiza en el backend     |
| antes de persistir, no como campo enmascarado.                        |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **RF-M02-01 --- Mapa de calor con scores de riesgo en tiempo real --- |
| M02 --- Mapa interactivo**                                            |
+=======================================================================+
| **Actor:** Comunidad Universitaria **Historia asociada:** HU-CU-02    |
| **Prioridad (IEEE 830): Alta**                                        |
+-----------------------------------------------------------------------+
| **Descripción**                                                       |
|                                                                       |
| El sistema debe mostrar un mapa geoespacial interactivo del campus y  |
| sus zonas aledañas con una capa de calor que refleje el nivel de      |
| riesgo actual por sector. Cada zona debe presentar un score numérico  |
| de 0 a 100 y un indicador semafórico (verde / ámbar / rojo) que se    |
| actualice automáticamente al recibir nuevos reportes validados.       |
+-----------------------------------------------------------------------+
| **Entradas:** Datos históricos de incidentes, score de riesgo         |
| calculado por PostGIS, polígonos de zonas                             |
|                                                                       |
| **Salidas:** Mapa georreferenciado con capa de calor, scores por      |
| zona, indicadores semafóricos                                         |
+-----------------------------------------------------------------------+
| **Flujo principal**                                                   |
|                                                                       |
| 6.  El usuario abre el módulo de mapa                                 |
|                                                                       |
| 7.  El sistema consulta los scores actuales por zona desde PostGIS    |
|                                                                       |
| 8.  Se renderiza el mapa con las capas de color correspondientes      |
|                                                                       |
| 9.  El usuario puede interactuar con cada zona para ver el detalle    |
+-----------------------------------------------------------------------+
| **Flujos alternativos**                                               |
|                                                                       |
| -   Filtro por tipo de incidente                                      |
|                                                                       |
| -   Filtro por franja horaria                                         |
|                                                                       |
| -   Filtro por rango de fechas                                        |
|                                                                       |
| **Excepciones**                                                       |
|                                                                       |
| -   Sin datos disponibles: el mapa muestra las zonas sin color y un   |
|     mensaje informativo                                               |
|                                                                       |
| -   Error de conectividad: el sistema muestra la última versión       |
|     cacheada con indicador de modo offline                            |
+-----------------------------------------------------------------------+
| **Criterios de aceptación (IEEE 830 §3.4)**                           |
|                                                                       |
| -   El mapa carga en menos de 3 segundos en condiciones normales de   |
|     red                                                               |
|                                                                       |
| -   El score de una zona se actualiza en el mapa en menos de 10       |
|     segundos tras un nuevo reporte validado                           |
|                                                                       |
| -   Las cuatro zonas críticas identificadas (Ad Portas, puente        |
|     peatonal, puerta de madera, entrada sur) siempre son visibles     |
+-----------------------------------------------------------------------+
| **Verificación Gherkin**                                              |
+-----------------------------------------------------------------------+
| **Feature: RF-M02-01 · Mapa de calor en tiempo real**                 |
|                                                                       |
| **Scenario: El mapa carga con las 4 zonas críticas en menos de 3      |
| segundos**                                                            |
|                                                                       |
| > **Given** el usuario autenticado abre el módulo de mapa             |
| >                                                                     |
| > **When** el componente termina de renderizar                        |
| >                                                                     |
| > **Then** muestra las zonas: Ad Portas, Puente peatonal, Puerta de   |
| > madera y Entrada sur                                                |
| >                                                                     |
| > **And** el tiempo total de carga es inferior a 3 segundos           |
|                                                                       |
| **Scenario: Codificación semafórica correcta por score**              |
|                                                                       |
| > **Given** una zona tiene score superior a 70                        |
| >                                                                     |
| > **Then** se muestra en rojo                                         |
| >                                                                     |
| > **Given** una zona tiene score entre 40 y 70                        |
| >                                                                     |
| > **Then** se muestra en ámbar                                        |
| >                                                                     |
| > **Given** una zona tiene score inferior a 40                        |
| >                                                                     |
| > **Then** se muestra en verde                                        |
|                                                                       |
| **Scenario: Actualización en tiempo real sin recargar la página**     |
|                                                                       |
| > **Given** el usuario tiene el mapa abierto                          |
| >                                                                     |
| > **When** se valida un nuevo reporte en una zona                     |
| >                                                                     |
| > **Then** el score de esa zona se actualiza en pantalla en menos de  |
| > 10 segundos                                                         |
| >                                                                     |
| > **And** el cambio es visible sin recargar la página                 |
+-----------------------------------------------------------------------+
| **Trazabilidad:** HU-CU-02 · RF-M03-01 · RF-M05-01 · RF-SYS-02        |
|                                                                       |
| **Restricción de diseño (IEEE 830 §3.5):** Web: Mapbox GL JS con capa |
| heatmap. Mobile: React Native Maps con marcadores coloreados. El      |
| score se calcula en el backend (PostGIS) y se distribuye via          |
| WebSockets (Socket.io). Los polígonos de zona se almacenan como       |
| geometrías en PostgreSQL + PostGIS.                                   |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **RF-SYS-03 --- Notificaciones push web y mobile --- SYS ---          |
| Transversal**                                                         |
+=======================================================================+
| **Actor:** Comunidad Universitaria / Administrador **Historia         |
| asociada:** HU-CU-03 **Prioridad (IEEE 830): Alta**                   |
+-----------------------------------------------------------------------+
| **Descripción**                                                       |
|                                                                       |
| El sistema debe enviar notificaciones push en tiempo real a los       |
| usuarios afectados por un incidente, tanto en la versión web (Web     |
| Push API con VAPID) como en la app móvil (APNs para iOS y FCM para    |
| Android). La latencia máxima desde la validación del reporte hasta la |
| entrega de la notificación debe ser de 30 segundos.                   |
+-----------------------------------------------------------------------+
| **Entradas:** Reporte validado, lista de usuarios suscritos con radio |
| de alerta activo, token push de cada dispositivo                      |
|                                                                       |
| **Salidas:** Notificación push entregada con: tipo de incidente, zona |
| afectada y score actualizado                                          |
+-----------------------------------------------------------------------+
| **Flujo principal**                                                   |
|                                                                       |
| 10. Se valida un reporte de incidente                                 |
|                                                                       |
| 11. El sistema calcula qué usuarios están dentro del radio de alerta  |
|                                                                       |
| 12. Se despachan las notificaciones a los tokens registrados en APNs  |
|     / FCM / VAPID                                                     |
|                                                                       |
| 13. El sistema registra la entrega con timestamp                      |
+-----------------------------------------------------------------------+
| **Flujos alternativos**                                               |
|                                                                       |
| -   El usuario tiene las notificaciones desactivadas: el sistema no   |
|     envía la notificación                                             |
|                                                                       |
| -   El radio de alerta está en 0 (desactivado): el sistema omite al   |
|     usuario                                                           |
|                                                                       |
| **Excepciones**                                                       |
|                                                                       |
| -   Token de push expirado o inválido: el sistema elimina el token de |
|     la base de datos y no reintenta                                   |
|                                                                       |
| -   Error del servicio APNs o FCM: el sistema registra el error y     |
|     reintenta hasta 3 veces con backoff exponencial                   |
+-----------------------------------------------------------------------+
| **Criterios de aceptación (IEEE 830 §3.4)**                           |
|                                                                       |
| -   Las notificaciones se entregan en menos de 30 segundos en el 95%  |
|     de los casos                                                      |
|                                                                       |
| -   Las notificaciones funcionan en iOS (APNs), Android (FCM) y       |
|     navegadores compatibles (VAPID)                                   |
|                                                                       |
| -   Los usuarios con radio desactivado no reciben notificaciones en   |
|     el 100% de los casos                                              |
+-----------------------------------------------------------------------+
| **Verificación Gherkin**                                              |
+-----------------------------------------------------------------------+
| **Feature: RF-SYS-02 · Notificaciones push**                          |
|                                                                       |
| **Scenario: Notificación entregada en menos de 30 segundos**          |
|                                                                       |
| > **Given** un reporte es validado en la zona Ad Portas               |
| >                                                                     |
| > **And** existen usuarios suscritos con radio de alerta activo para  |
| > esa zona                                                            |
| >                                                                     |
| > **When** el sistema despacha las notificaciones                     |
| >                                                                     |
| > **Then** cada usuario afectado recibe la notificación en menos de   |
| > 30 segundos                                                         |
| >                                                                     |
| > **And** la notificación incluye: tipo de incidente, zona y score    |
| > actualizado                                                         |
|                                                                       |
| **Scenario: Usuario con radio desactivado no recibe notificación**    |
|                                                                       |
| > **Given** un usuario tiene el radio de alerta en \"Desactivado\"    |
| >                                                                     |
| > **When** se genera una alerta en una zona cercana                   |
| >                                                                     |
| > **Then** el sistema no envía ninguna notificación push a ese        |
| > usuario                                                             |
+-----------------------------------------------------------------------+
| **Trazabilidad:** HU-CU-03 · RF-M03-01 · RF-M02-02                    |
|                                                                       |
| **Restricción de diseño (IEEE 830 §3.5):** La API de Expo             |
| Notifications centraliza el envío a APNs y FCM. Web Push requiere     |
| Service Worker registrado y suscripción VAPID. El backend mantiene    |
| tabla push_subscriptions asociada al usuario y plataforma. No se      |
| envían notificaciones entre las 12am y las 6am salvo configuración    |
| explícita del usuario.                                                |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **RF-M06-01 --- Panel de control de incidentes en tiempo real --- M06 |
| --- Análisis e inteligencia**                                         |
+=======================================================================+
| **Actor:** Administrador de Seguridad **Historia asociada:** HU-AD-02 |
| **Prioridad (IEEE 830): Media**                                       |
+-----------------------------------------------------------------------+
| **Descripción**                                                       |
|                                                                       |
| El sistema debe proveer al Administrador de Seguridad un panel web    |
| que consolide todos los incidentes activos en tiempo real,            |
| actualizado vía WebSockets sin recarga de página. El administrador    |
| debe poder gestionar el estado de cada incidente (nuevo / en atención |
| / cerrado) y agregar notas de gestión.                                |
+-----------------------------------------------------------------------+
| **Entradas:** Incidentes activos del sistema de reportes, cambios de  |
| estado del administrador                                              |
|                                                                       |
| **Salidas:** Panel actualizado en tiempo real, historial auditable de |
| cambios de estado                                                     |
+-----------------------------------------------------------------------+
| **Flujo principal**                                                   |
|                                                                       |
| 14. El administrador accede al panel con su rol institucional         |
|                                                                       |
| 15. El sistema muestra todos los incidentes activos ordenados por     |
|     prioridad                                                         |
|                                                                       |
| 16. Los incidentes nuevos aparecen automáticamente vía WebSocket      |
|                                                                       |
| 17. El administrador gestiona el estado y agrega notas                |
+-----------------------------------------------------------------------+
| **Flujos alternativos**                                               |
|                                                                       |
| -   Filtro por zona                                                   |
|                                                                       |
| -   Filtro por tipo de incidente                                      |
|                                                                       |
| -   Filtro por estado                                                 |
|                                                                       |
| **Excepciones**                                                       |
|                                                                       |
| -   Sin incidentes activos: el panel muestra mensaje \"Sin incidentes |
|     activos en este momento\"                                         |
|                                                                       |
| -   Pérdida de conexión WebSocket: el sistema reintenta la conexión   |
|     automáticamente y muestra indicador de reconexión                 |
+-----------------------------------------------------------------------+
| **Criterios de aceptación (IEEE 830 §3.4)**                           |
|                                                                       |
| -   Los incidentes nuevos aparecen en el panel en menos de 5 segundos |
|     sin recargar la página                                            |
|                                                                       |
| -   Los incidentes con score de zona superior a 75 se destacan como   |
|     prioridad alta en el 100% de los casos                            |
|                                                                       |
| -   El historial de cambios de estado es auditable con timestamp y    |
|     nombre del administrador                                          |
+-----------------------------------------------------------------------+
| **Verificación Gherkin**                                              |
+-----------------------------------------------------------------------+
| **Feature: RF-M06-01 · Panel en tiempo real**                         |
|                                                                       |
| **Scenario: Nuevo incidente aparece sin recargar la página**          |
|                                                                       |
| > **Given** el administrador tiene el panel abierto                   |
| >                                                                     |
| > **When** un usuario registra un nuevo incidente                     |
| >                                                                     |
| > **Then** el incidente aparece en el panel en menos de 5 segundos    |
| >                                                                     |
| > **And** el panel emite una señal visual indicando el nuevo evento   |
|                                                                       |
| **Scenario: El administrador cierra un incidente con nota**           |
|                                                                       |
| > **Given** el administrador visualiza un incidente con estado \"en   |
| > atención\"                                                          |
| >                                                                     |
| > **When** cambia el estado a \"cerrado\" y agrega una nota de        |
| > gestión                                                             |
| >                                                                     |
| > **Then** el cambio queda registrado con timestamp y nombre del      |
| > administrador                                                       |
| >                                                                     |
| > **And** el incidente desaparece de la cola de activos               |
+-----------------------------------------------------------------------+
| **Trazabilidad:** HU-AD-02 · RF-M01-01 · RF-SYS-01 · RF-M03-01        |
|                                                                       |
| **Restricción de diseño (IEEE 830 §3.5):** El canal WebSocket usa     |
| Socket.io con rooms por zona para minimizar el broadcast. El          |
| historial de cambios de estado se persiste en tabla                   |
| incident_audit_log. El acceso al panel es exclusivo del rol           |
| \"Administrador de Seguridad\" verificado por middleware RBAC.        |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **RF-M05-01 --- Recomendaciones de ruta con modelo predictivo --- M05 |
| --- Recomendaciones con IA**                                          |
+=======================================================================+
| **Actor:** Comunidad Universitaria **Historia asociada:** HU-CU-04    |
| **Prioridad (IEEE 830): Media**                                       |
+-----------------------------------------------------------------------+
| **Descripción**                                                       |
|                                                                       |
| El sistema debe generar recomendaciones de ruta personalizadas        |
| basadas en el score de riesgo actual de cada zona, el horario del     |
| usuario y los patrones históricos de incidentes. Las recomendaciones  |
| deben incluir: ruta sugerida, tiempo adicional estimado en minutos y  |
| porcentaje de reducción de riesgo respecto a la ruta habitual.        |
+-----------------------------------------------------------------------+
| **Entradas:** Zona origen, zona destino, hora y día de la semana del  |
| usuario                                                               |
|                                                                       |
| **Salidas:** Ruta recomendada con: descripción, tiempo adicional y    |
| reducción de riesgo en porcentaje                                     |
+-----------------------------------------------------------------------+
| **Flujo principal**                                                   |
|                                                                       |
| 18. El usuario consulta el módulo de recomendaciones                  |
|                                                                       |
| 19. El sistema envía la solicitud al microservicio ML (POST           |
|     /recommend)                                                       |
|                                                                       |
| 20. El microservicio evalúa las rutas disponibles por score           |
|                                                                       |
| 21. El sistema devuelve la ruta de menor riesgo con sus métricas      |
+-----------------------------------------------------------------------+
| **Flujos alternativos**                                               |
|                                                                       |
| -   Variación automática de recomendaciones por franja horaria        |
|     (6--12h, 12--18h, 18--24h)                                        |
|                                                                       |
| **Excepciones**                                                       |
|                                                                       |
| -   Microservicio ML no disponible: el sistema sugiere la ruta de     |
|     menor riesgo histórico sin predicción en tiempo real              |
|                                                                       |
| -   Todas las rutas con score alto: el sistema avisa explícitamente y |
|     sugiere el horario de menor riesgo histórico                      |
+-----------------------------------------------------------------------+
| **Criterios de aceptación (IEEE 830 §3.4)**                           |
|                                                                       |
| -   Las recomendaciones se generan en menos de 2 segundos en el 95%   |
|     de los casos                                                      |
|                                                                       |
| -   Las sugerencias de ruta varían según la franja horaria en el 100% |
|     de los escenarios                                                 |
|                                                                       |
| -   La reducción de riesgo reportada es calculada a partir del score  |
|     actual, no estimada arbitrariamente                               |
+-----------------------------------------------------------------------+
| **Verificación Gherkin**                                              |
+-----------------------------------------------------------------------+
| **Feature: RF-M05-01 · Recomendaciones de ruta**                      |
|                                                                       |
| **Scenario: Recomendación generada en menos de 2 segundos**           |
|                                                                       |
| > **Given** el microservicio ML está operativo                        |
| >                                                                     |
| > **When** el usuario solicita una recomendación de ruta              |
| >                                                                     |
| > **Then** la respuesta aparece en pantalla en menos de 2 segundos    |
| >                                                                     |
| > **And** incluye: ruta sugerida, tiempo adicional y reducción de     |
| > riesgo en porcentaje                                                |
|                                                                       |
| **Scenario: Sistema alerta cuando todas las rutas son de alto         |
| riesgo**                                                              |
|                                                                       |
| > **Given** todas las rutas disponibles tienen score superior a 70    |
| >                                                                     |
| > **When** el usuario solicita una recomendación                      |
| >                                                                     |
| > **Then** el sistema muestra: \"Todas las rutas presentan riesgo     |
| > elevado\"                                                           |
| >                                                                     |
| > **And** sugiere el horario histórico de menor riesgo para ese       |
| > trayecto                                                            |
+-----------------------------------------------------------------------+
| **Trazabilidad:** HU-CU-04 · RF-M02-01 · RF-M05-02                    |
|                                                                       |
| **Restricción de diseño (IEEE 830 §3.5):** El microservicio ML expone |
| endpoint POST /recommend con parámetros {zona_origen, zona_destino,   |
| hora, dia_semana}. El modelo debe estar entrenado con mínimo 4        |
| semanas de datos reales antes de activarse en producción. Tiempo      |
| máximo de respuesta del microservicio: 2 segundos (P95).              |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **RF-M06-02 --- Exportación de reportes estadísticos --- M06 ---      |
| Análisis e inteligencia**                                             |
+=======================================================================+
| **Actor:** Administrador de Seguridad **Historia asociada:** HU-AD-03 |
| **Prioridad (IEEE 830): Baja**                                        |
+-----------------------------------------------------------------------+
| **Descripción**                                                       |
|                                                                       |
| El sistema debe generar y exportar reportes estadísticos en formato   |
| PDF y Excel que incluyan: ranking de zonas por número de incidentes,  |
| distribución por tipo de incidente, mapa de calor semanal y           |
| comparación porcentual con la semana anterior. El sistema debe enviar |
| automáticamente el reporte cada lunes a las 8am al correo             |
| institucional del administrador.                                      |
+-----------------------------------------------------------------------+
| **Entradas:** Rango de fechas, tipo de incidente (filtro opcional),   |
| zona (filtro opcional)                                                |
|                                                                       |
| **Salidas:** Archivo PDF o Excel descargable, correo automático con   |
| reporte semanal adjunto                                               |
+-----------------------------------------------------------------------+
| **Flujo principal**                                                   |
|                                                                       |
| 22. El administrador selecciona el rango de fechas y filtros          |
|     opcionales                                                        |
|                                                                       |
| 23. El sistema genera las gráficas server-side y ensambla el reporte  |
|                                                                       |
| 24. El usuario descarga el archivo en el formato seleccionado         |
+-----------------------------------------------------------------------+
| **Flujos alternativos**                                               |
|                                                                       |
| -   Filtro por zona específica                                        |
|                                                                       |
| -   Filtro por tipo de incidente                                      |
|                                                                       |
| -   Envío automático programado cada lunes a las 8am                  |
|                                                                       |
| **Excepciones**                                                       |
|                                                                       |
| -   Sin datos para el rango seleccionado: el sistema genera el        |
|     reporte con sección vacía e indicación explícita                  |
|                                                                       |
| -   Error en generación de PDF: el sistema notifica al administrador  |
|     y registra el fallo                                               |
+-----------------------------------------------------------------------+
| **Criterios de aceptación (IEEE 830 §3.4)**                           |
|                                                                       |
| -   El archivo se descarga en menos de 10 segundos desde la solicitud |
|                                                                       |
| -   El reporte contiene exclusivamente datos del rango de fechas      |
|     seleccionado, sin mezclar periodos                                |
|                                                                       |
| -   El envío automático semanal funciona sin intervención manual del  |
|     administrador                                                     |
+-----------------------------------------------------------------------+
| **Verificación Gherkin**                                              |
+-----------------------------------------------------------------------+
| **Feature: RF-M06-02 · Exportación de reportes**                      |
|                                                                       |
| **Scenario: Exportación en menos de 10 segundos**                     |
|                                                                       |
| > **Given** el administrador selecciona un rango de fechas y hace     |
| > clic en \"Exportar PDF\"                                            |
| >                                                                     |
| > **When** el sistema genera el reporte                               |
| >                                                                     |
| > **Then** el archivo se descarga en menos de 10 segundos             |
| >                                                                     |
| > **And** contiene las secciones: ranking de zonas, distribución por  |
| > tipo, mapa de calor y comparación semanal                           |
|                                                                       |
| **Scenario: Envío automático cada lunes a las 8am**                   |
|                                                                       |
| > **Given** el administrador tiene registrado su correo institucional |
| >                                                                     |
| > **When** son las 08:00 del lunes                                    |
| >                                                                     |
| > **Then** el sistema genera y envía el reporte de la semana anterior |
| > al correo del administrador                                         |
| >                                                                     |
| > **And** el correo incluye el PDF adjunto y resumen ejecutivo en el  |
| > cuerpo del mensaje                                                  |
+-----------------------------------------------------------------------+
| **Trazabilidad:** HU-AD-03 · RF-M06-01 · RF-M05-02                    |
|                                                                       |
| **Restricción de diseño (IEEE 830 §3.5):** Las gráficas se generan    |
| server-side con Matplotlib/Seaborn y se embeben en el PDF. El cron    |
| job usa node-cron o tarea programada en Railway/Render. Los reportes  |
| generados se archivan en S3/R2 por 90 días. El servicio de correo usa |
| Resend con plantillas HTML institucionales.                           |
+-----------------------------------------------------------------------+

# **8. Requisitos No Funcionales --- ISO/IEC 25010:2023**

Los requisitos no funcionales se definen bajo el estándar ISO/IEC
25010:2023 (modelo SQuaRE actualizado), que especifica las
características de calidad del producto software. A diferencia de la
versión 2011, la edición 2023 reorganiza las características e incorpora
Safety como categoría independiente. Cada RNF incluye la característica
y subcaracterística específica del estándar, métrica cuantificable y
criterio de verificación en formato Gherkin.

## **8.1 Marco de calidad ISO/IEC 25010:2023**

  -------------------------------------------------------------------------------
  **Código**   **Característica**   **Subcaracterísticas   **RNF asociados**
                                    relevantes**           
  ------------ -------------------- ---------------------- ----------------------
  **PERF**     **Eficiencia de      Comportamiento en el   *RNF-PERF-01,
               desempeño**          tiempo, utilización de RNF-PERF-02*
                                    recursos, capacidad    

  **SEG**      **Seguridad**        Confidencialidad,      *RNF-SEG-01,
                                    integridad,            RNF-SEG-02,
                                    autenticidad,          RNF-SEG-03*
                                    responsabilidad,       
                                    resistencia            

  **USE**      **Usabilidad**       Capacidad de           *RNF-USE-01,
                                    aprendizaje,           RNF-USE-02*
                                    operabilidad,          
                                    accesibilidad,         
                                    protección ante        
                                    errores                

  **REL**      **Fiabilidad**       Disponibilidad,        *RNF-REL-01,
                                    tolerancia a fallos,   RNF-REL-02*
                                    capacidad de           
                                    recuperación           

  **MANT**     **Mantenibilidad**   Modularidad,           *RNF-MANT-01*
                                    reusabilidad,          
                                    analizabilidad,        
                                    capacidad de           
                                    modificación           

  **PORT**     **Portabilidad**     Adaptabilidad,         *RNF-PORT-01*
                                    instalabilidad,        
                                    capacidad de reemplazo 

  **COMP**     **Compatibilidad**   Coexistencia,          *RNF-COMP-01*
                                    interoperabilidad con  
                                    sistemas externos      
  -------------------------------------------------------------------------------

## **8.2 Lista de Requisitos No Funcionales**

+-----------------------------------------------------------------------+
| **RNF-AUTH-01 --- Seguridad del token de autenticación**              |
+=======================================================================+
| **Categoría ISO/IEC 25010:2023: Seguridad Subcaracterística:**        |
| Confidencialidad + Resistencia (ISO/IEC 25010:2023 §4.2.1, §4.2.6)    |
| **Prioridad: Crítica**                                                |
+-----------------------------------------------------------------------+
| **Descripción**                                                       |
|                                                                       |
| El JWT emitido por el sistema debe firmarse con algoritmo RS256 (par  |
| de claves asimétricas). El token debe tener una vigencia máxima de 24 |
| horas. El refresh token debe almacenarse en una httpOnly cookie con   |
| atributos SameSite=Strict y Secure=true, sin ser accesible desde      |
| JavaScript. Las claves de firma nunca deben incluirse en el           |
| repositorio de código.                                                |
+-----------------------------------------------------------------------+
| **Métricas de verificación**                                          |
|                                                                       |
| -   Algoritmo de firma del JWT: RS256 verificado con inspección del   |
|     header del token                                                  |
|                                                                       |
| -   Vigencia del JWT ≤ 24 horas verificada en el campo exp del        |
|     payload                                                           |
|                                                                       |
| -   Refresh token almacenado en httpOnly cookie con SameSite=Strict y |
|     Secure=true verificado con DevTools                               |
|                                                                       |
| -   Clave privada de firma no presente en el repositorio de código    |
|     verificado con auditoría de git history                           |
|                                                                       |
| -   0 tokens válidos con tiempo de expiración mayor a 24 horas en     |
|     base de datos                                                     |
+-----------------------------------------------------------------------+
| **Criterios de aceptación**                                           |
|                                                                       |
| -   Ningún JWT válido usa algoritmo distinto a RS256                  |
|                                                                       |
| -   El refresh token no es accesible desde JavaScript en el 100% de   |
|     las pruebas de acceso desde consola del navegador                 |
|                                                                       |
| -   Las claves de firma se gestionan exclusivamente como variables de |
|     entorno, nunca en archivos del repositorio                        |
+-----------------------------------------------------------------------+
| **Verificación Gherkin (ISO/IEC 25010:2023)**                         |
+-----------------------------------------------------------------------+
| **Feature: RNF-AUTH-01 · Seguridad del token**                        |
|                                                                       |
| **Scenario: JWT firmado con RS256 y vigencia de 24 horas**            |
|                                                                       |
| > **Given** el usuario completa el login exitosamente                 |
| >                                                                     |
| > **When** se decodifica el header del JWT emitido                    |
| >                                                                     |
| > **Then** el campo alg contiene el valor \"RS256\"                   |
| >                                                                     |
| > **And** el campo exp del payload es exactamente 24 horas después    |
| > del campo iat                                                       |
|                                                                       |
| **Scenario: Refresh token inaccesible desde JavaScript**              |
|                                                                       |
| > **Given** el usuario tiene una sesión activa                        |
| >                                                                     |
| > **When** se ejecuta document.cookie en la consola del navegador     |
| >                                                                     |
| > **Then** el refresh token no aparece en el resultado                |
| >                                                                     |
| > **And** la cookie tiene los atributos HttpOnly y SameSite=Strict    |
| > confirmados en las DevTools                                         |
|                                                                       |
| **Scenario: Token con firma inválida es rechazado**                   |
|                                                                       |
| > **Given** un atacante modifica el payload de un JWT válido sin      |
| > actualizar la firma                                                 |
| >                                                                     |
| > **When** envía la petición con ese token al servidor                |
| >                                                                     |
| > **Then** el servidor responde con código 401 Unauthorized           |
| >                                                                     |
| > **And** el intento queda registrado en el log de auditoría de       |
| > seguridad                                                           |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **RNF-AUTH-02 --- Protección contra ataques de fuerza bruta**         |
+=======================================================================+
| **Categoría ISO/IEC 25010:2023: Seguridad Subcaracterística:**        |
| Resistencia (ISO/IEC 25010:2023 §4.2.6) **Prioridad: Crítica**        |
+-----------------------------------------------------------------------+
| **Descripción**                                                       |
|                                                                       |
| El sistema debe implementar rate limiting en el endpoint de login     |
| para prevenir ataques de fuerza bruta. Debe limitar a un máximo de 10 |
| peticiones por minuto por dirección IP al endpoint POST               |
| /api/auth/login. Adicionalmente, tras 5 intentos fallidos             |
| consecutivos por cuenta en un periodo de 15 minutos, la cuenta debe   |
| bloquearse temporalmente por 15 minutos independientemente de la IP   |
| de origen.                                                            |
+-----------------------------------------------------------------------+
| **Métricas de verificación**                                          |
|                                                                       |
| -   Rate limiting de 10 req/min por IP en el endpoint POST            |
|     /api/auth/login verificado con prueba de carga                    |
|                                                                       |
| -   Bloqueo de cuenta tras 5 intentos fallidos en 15 minutos en el    |
|     100% de los casos                                                 |
|                                                                       |
| -   El bloqueo de cuenta es independiente de la IP de origen          |
|     (persiste aunque cambie la red)                                   |
|                                                                       |
| -   Respuesta HTTP 429 Too Many Requests cuando se supera el límite   |
|     de rate limiting                                                  |
+-----------------------------------------------------------------------+
| **Criterios de aceptación**                                           |
|                                                                       |
| -   El endpoint de login devuelve 429 al superar 10 peticiones por    |
|     minuto desde la misma IP                                          |
|                                                                       |
| -   La cuenta queda bloqueada 15 minutos tras 5 intentos fallidos     |
|     consecutivos en cualquier escenario de prueba                     |
|                                                                       |
| -   El bloqueo persiste aunque el atacante cambie de dirección IP     |
+-----------------------------------------------------------------------+
| **Verificación Gherkin (ISO/IEC 25010:2023)**                         |
+-----------------------------------------------------------------------+
| **Feature: RNF-AUTH-02 · Protección fuerza bruta**                    |
|                                                                       |
| **Scenario: Rate limiting activo en endpoint de login**               |
|                                                                       |
| > **Given** una IP envía 11 peticiones al endpoint POST               |
| > /api/auth/login en menos de 60 segundos                             |
| >                                                                     |
| > **When** se envía la petición número 11                             |
| >                                                                     |
| > **Then** el servidor responde con código 429 Too Many Requests      |
| >                                                                     |
| > **And** el header Retry-After indica el tiempo de espera en         |
| > segundos                                                            |
|                                                                       |
| **Scenario: Bloqueo de cuenta independiente de IP tras 5 intentos     |
| fallidos**                                                            |
|                                                                       |
| > **Given** el usuario ha fallado 5 veces con el correo               |
| > <victima@unisabana.edu.co> desde una IP                             |
| >                                                                     |
| > **When** el mismo usuario intenta desde una IP diferente            |
| >                                                                     |
| > **Then** el sistema bloquea igualmente el acceso a esa cuenta       |
| >                                                                     |
| > **And** muestra el mensaje de bloqueo temporal sin importar la IP   |
| > de origen                                                           |
+-----------------------------------------------------------------------+
| **RNF-AUTH-03 --- Auditoría de eventos de autenticación**             |
+-----------------------------------------------------------------------+
| **Categoría ISO/IEC 25010:2023: Seguridad Subcaracterística:**        |
| Responsabilidad (ISO/IEC 25010:2023 §4.2.5) **Prioridad: Alta**       |
+-----------------------------------------------------------------------+
| **Descripción**                                                       |
|                                                                       |
| El sistema debe registrar en un log de auditoría todos los eventos    |
| críticos de autenticación: login exitoso, login fallido, bloqueo de   |
| cuenta, cierre de sesión, renovación de token y cambio de rol. Cada   |
| registro debe incluir: timestamp UTC, correo del usuario, tipo de     |
| evento, IP de origen y resultado (éxito / fallo). Los logs deben      |
| conservarse durante un mínimo de 90 días.                             |
+-----------------------------------------------------------------------+
| **Métricas de verificación**                                          |
|                                                                       |
| -   100% de eventos de autenticación críticos registrados en el log   |
|     de auditoría                                                      |
|                                                                       |
| -   Cada registro contiene: timestamp UTC, correo, tipo de evento, IP |
|     de origen y resultado                                             |
|                                                                       |
| -   Logs conservados durante mínimo 90 días con acceso exclusivo para |
|     el rol de Administrador del sistema                               |
|                                                                       |
| -   0 eventos de autenticación sin registro en pruebas de auditoría   |
+-----------------------------------------------------------------------+
| **Criterios de aceptación**                                           |
|                                                                       |
| -   Todos los eventos críticos de autenticación quedan registrados    |
|     con la información requerida                                      |
|                                                                       |
| -   Los logs son consultables únicamente por el Administrador del     |
|     sistema desde el panel de gestión                                 |
|                                                                       |
| -   Los registros de los últimos 90 días están disponibles en todo    |
|     momento para auditoría                                            |
+-----------------------------------------------------------------------+
| **Verificación Gherkin (ISO/IEC 25010:2023)**                         |
+-----------------------------------------------------------------------+
| **Feature: RNF-AUTH-03 · Auditoría de autenticación**                 |
|                                                                       |
| **Scenario: Login exitoso queda registrado en el log con todos los    |
| campos requeridos**                                                   |
|                                                                       |
| > **Given** el usuario completa el login exitosamente                 |
| >                                                                     |
| > **When** se consulta el log de auditoría                            |
| >                                                                     |
| > **Then** existe un registro con: timestamp UTC, correo del usuario, |
| > tipo \"login_success\", IP de origen y resultado \"success\"        |
|                                                                       |
| **Scenario: Bloqueo de cuenta queda registrado en el log**            |
|                                                                       |
| > **Given** la cuenta de un usuario es bloqueada por intentos         |
| > fallidos                                                            |
| >                                                                     |
| > **When** se consulta el log de auditoría                            |
| >                                                                     |
| > **Then** existe un registro con tipo \"account_locked\", el correo  |
| > afectado, la IP de origen y el timestamp UTC del bloqueo            |
|                                                                       |
| **Scenario: Logs de los últimos 90 días disponibles para auditoría**  |
|                                                                       |
| > **Given** han transcurrido 85 días desde el primer evento de        |
| > autenticación registrado                                            |
| >                                                                     |
| > **When** el administrador consulta el log de esa fecha              |
| >                                                                     |
| > **Then** el registro está disponible y accesible desde el panel de  |
| > gestión                                                             |
| >                                                                     |
| > **And** los registros con más de 90 días han sido archivados o      |
| > eliminados según la política de retención                           |
+-----------------------------------------------------------------------+
| **RNF-AUTH-04 --- Rendimiento del sistema de autenticación**          |
+-----------------------------------------------------------------------+
| **Categoría ISO/IEC 25010:2023: Eficiencia de desempeño               |
| Subcaracterística:** Comportamiento en el tiempo (ISO/IEC 25010:2023  |
| §4.1.1) **Prioridad: Alta**                                           |
+-----------------------------------------------------------------------+
| **Descripción**                                                       |
|                                                                       |
| El endpoint de login debe procesar y responder en menos de 3 segundos |
| en condiciones normales de carga (P95), incluyendo la validación de   |
| credenciales con bcrypt, la consulta a base de datos, la emisión del  |
| JWT y la configuración de la cookie de refresh token. El sistema de   |
| autenticación debe soportar al menos 200 logins concurrentes sin      |
| degradación.                                                          |
+-----------------------------------------------------------------------+
| **Métricas de verificación**                                          |
|                                                                       |
| -   P95 de latencia del endpoint POST /api/auth/login ≤ 3000 ms bajo  |
|     carga de 100 usuarios concurrentes                                |
|                                                                       |
| -   Tiempo de hashing bcrypt ≤ 500 ms con cost factor 12 verificado   |
|     con benchmark                                                     |
|                                                                       |
| -   Sin errores 5xx en el endpoint de login bajo carga de 200 logins  |
|     concurrentes                                                      |
|                                                                       |
| -   El sistema soporta al menos 200 logins simultáneos sin            |
|     degradación perceptible del servicio                              |
+-----------------------------------------------------------------------+
| **Criterios de aceptación**                                           |
|                                                                       |
| -   El login completo ocurre en menos de 3 segundos en el 95% de los  |
|     casos bajo carga normal                                           |
|                                                                       |
| -   El sistema no produce errores 500 ni 503 bajo carga de 200 logins |
|     concurrentes                                                      |
|                                                                       |
| -   El tiempo de hashing bcrypt con cost factor 12 no supera los 500  |
|     ms                                                                |
+-----------------------------------------------------------------------+
| **Verificación Gherkin (ISO/IEC 25010:2023)**                         |
+-----------------------------------------------------------------------+
| **Feature: RNF-AUTH-04 · Rendimiento del login**                      |
|                                                                       |
| **Scenario: Login completo en menos de 3 segundos bajo carga normal** |
|                                                                       |
| > **Given** el sistema está operativo con 100 usuarios realizando     |
| > login concurrentemente                                              |
| >                                                                     |
| > **When** se mide la latencia del endpoint POST /api/auth/login con  |
| > k6                                                                  |
| >                                                                     |
| > **Then** el percentil 95 de latencia es inferior a 3000 ms          |
| >                                                                     |
| > **And** la tasa de error es inferior al 1%                          |
|                                                                       |
| **Scenario: Sistema soporta 200 logins simultáneos sin errores**      |
|                                                                       |
| > **Given** se simulan 200 logins concurrentes con credenciales       |
| > válidas                                                             |
| >                                                                     |
| > **When** todos los usuarios presionan \"Iniciar sesión\"            |
| > simultáneamente                                                     |
| >                                                                     |
| > **Then** no se producen errores HTTP 500 ni 503                     |
| >                                                                     |
| > **And** todos los usuarios reciben su JWT en menos de 5 segundos    |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **RNF-I18N-01 --- Cobertura y consistencia de la                      |
| internacionalización**                                                |
+=======================================================================+
| **Categoría ISO/IEC 25010:2023: Usabilidad Subcaracterística:**       |
| Accesibilidad + Operabilidad (§4.4.7, §4.4.3) **Prioridad: Media**    |
+-----------------------------------------------------------------------+
| **Descripción**                                                       |
|                                                                       |
| El sistema debe garantizar una cobertura de traducción del 100% en    |
| todos los elementos de la interfaz de usuario para los dos idiomas    |
| soportados (español e inglés). Ningún texto visible puede aparecer en |
| un idioma distinto al seleccionado. El cambio de idioma debe          |
| completarse en menos de 500 ms sin recargar la aplicación. Los textos |
| de seguridad críticos (tipos de incidente, alertas, confirmaciones de |
| reporte) deben contar con una traducción revisada por un hablante     |
| nativo de inglés, no generada automáticamente.                        |
+-----------------------------------------------------------------------+
| **Métricas de verificación**                                          |
|                                                                       |
| -   100% de cadenas de texto de la interfaz traducidas en ambos       |
|     idiomas, verificado con auditoría de archivos i18n                |
|                                                                       |
| -   0 cadenas sin traducir (fallback al idioma original) visibles en  |
|     ninguna vista tras el cambio de idioma                            |
|                                                                       |
| -   Tiempo de cambio de idioma ≤ 500 ms medido desde la selección     |
|     hasta la aplicación completa en la interfaz                       |
|                                                                       |
| -   Textos de seguridad críticos revisados y aprobados por hablante   |
|     nativo de inglés antes del despliegue a producción                |
|                                                                       |
| -   Preferencia de idioma persistida correctamente en el 100% de los  |
|     cierres y reaperturas de sesión                                   |
+-----------------------------------------------------------------------+
| **Criterios de aceptación**                                           |
|                                                                       |
| -   El cambio de idioma ocurre en menos de 500 ms sin recargar la     |
|     aplicación en el 100% de los casos                                |
|                                                                       |
| -   Ningún texto en español es visible cuando el idioma está          |
|     configurado en inglés, y viceversa                                |
|                                                                       |
| -   Los textos de seguridad críticos son precisos y comprensibles     |
|     para un hablante nativo de inglés, documentado con acta de        |
|     revisión                                                          |
+-----------------------------------------------------------------------+
| **Verificación Gherkin (ISO/IEC 25010:2023)**                         |
+-----------------------------------------------------------------------+
| **Feature: RNF-I18N-01 · Cobertura de traducción**                    |
|                                                                       |
| **Scenario: Language switch completes in less than 500 ms without     |
| reload**                                                              |
|                                                                       |
| > **Given** the application is loaded and the user is authenticated   |
| >                                                                     |
| > **When** the user selects a different language from the settings    |
| >                                                                     |
| > **Then** the entire interface updates in less than 500 ms           |
| >                                                                     |
| > **And** no spinner or loading indicator is shown during the         |
| > transition                                                          |
|                                                                       |
| **Scenario: 100% translation coverage verified by i18n audit**        |
|                                                                       |
| > **Given** the i18n audit tool scans all views with language set to  |
| > English                                                             |
| >                                                                     |
| > **When** it checks every visible text element in the application    |
| >                                                                     |
| > **Then** 0 fallback strings in Spanish are detected                 |
| >                                                                     |
| > **And** the audit report shows 100% of translation keys covered     |
|                                                                       |
| **Scenario: Safety-critical texts reviewed by a native English        |
| speaker**                                                             |
|                                                                       |
| > **Given** a native English speaker reviews all translated strings   |
| > in the security modules                                             |
| >                                                                     |
| > **When** they evaluate the incident types, alert messages and       |
| > report confirmations                                                |
| >                                                                     |
| > **Then** all critical texts are precise and unambiguous in English  |
| >                                                                     |
| > **And** the review sign-off is documented before production         |
| > deployment                                                          |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **RNF-PERF-01 --- Tiempo de respuesta de la API**                     |
+=======================================================================+
| **Categoría ISO/IEC 25010:2023: Eficiencia de desempeño               |
| Subcaracterística:** Comportamiento en el tiempo (ISO/IEC 25010:2023  |
| §4.1.1) **Prioridad: Alta**                                           |
+-----------------------------------------------------------------------+
| **Descripción**                                                       |
|                                                                       |
| El sistema debe responder a todas las peticiones de la API REST en    |
| menos de 500 ms en condiciones normales de carga (P95). Las           |
| peticiones al microservicio ML (recomendaciones de ruta) deben        |
| resolverse en menos de 2 segundos (P95).                              |
+-----------------------------------------------------------------------+
| **Métricas de verificación**                                          |
|                                                                       |
| -   P95 de latencia API REST ≤ 500 ms bajo 100 usuarios concurrentes  |
|                                                                       |
| -   P95 de latencia microservicio ML ≤ 2000 ms bajo 50 peticiones     |
|     simultáneas                                                       |
|                                                                       |
| -   Tasa de error inferior al 1% en condiciones de carga nominal      |
+-----------------------------------------------------------------------+
| **Criterios de aceptación**                                           |
|                                                                       |
| -   El 95% de las solicitudes de la API REST cumplen el tiempo máximo |
|     bajo carga de 100 usuarios concurrentes                           |
|                                                                       |
| -   Las peticiones al microservicio ML se resuelven en menos de 2     |
|     segundos en el 95% de los casos                                   |
|                                                                       |
| -   El sistema no produce errores HTTP 500 bajo carga normal          |
+-----------------------------------------------------------------------+
| **Verificación Gherkin (ISO/IEC 25010:2023)**                         |
+-----------------------------------------------------------------------+
| **Feature: RNF-PERF-01 · Tiempo de respuesta**                        |
|                                                                       |
| **Scenario: API REST responde en menos de 500 ms bajo carga de 100    |
| usuarios**                                                            |
|                                                                       |
| > **Given** el sistema está operativo con 100 usuarios concurrentes   |
| > simulados por k6                                                    |
| >                                                                     |
| > **When** se ejecutan 1000 peticiones al endpoint GET                |
| > /api/zones/scores                                                   |
| >                                                                     |
| > **Then** el percentil 95 de latencia es inferior a 500 ms           |
| >                                                                     |
| > **And** la tasa de error es inferior al 1%                          |
|                                                                       |
| **Scenario: Microservicio ML responde en menos de 2 segundos**        |
|                                                                       |
| > **Given** el modelo XGBoost está cargado en memoria                 |
| >                                                                     |
| > **When** se envían 50 peticiones simultáneas al endpoint POST       |
| > /recommend                                                          |
| >                                                                     |
| > **Then** el percentil 95 de latencia es inferior a 2000 ms          |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **RNF-PERF-02 --- Capacidad de usuarios concurrentes**                |
+=======================================================================+
| **Categoría ISO/IEC 25010:2023: Eficiencia de desempeño               |
| Subcaracterística:** Capacidad (ISO/IEC 25010:2023 §4.1.3)            |
| **Prioridad: Alta**                                                   |
+-----------------------------------------------------------------------+
| **Descripción**                                                       |
|                                                                       |
| El sistema debe soportar al menos 500 usuarios concurrentes activos   |
| durante el piloto universitario sin degradación perceptible del       |
| servicio. En un escenario de pico debe mantener operatividad con      |
| hasta 1.000 conexiones simultáneas.                                   |
+-----------------------------------------------------------------------+
| **Métricas de verificación**                                          |
|                                                                       |
| -   Throughput ≥ 200 req/s en carga nominal                           |
|                                                                       |
| -   Degradación de latencia ≤ 20% al pasar de 100 a 500 usuarios      |
|     concurrentes                                                      |
|                                                                       |
| -   Sin errores HTTP 5xx en carga nominal (500 usuarios)              |
+-----------------------------------------------------------------------+
| **Criterios de aceptación**                                           |
|                                                                       |
| -   El sistema opera de forma estable con 500 usuarios concurrentes   |
|     durante 5 minutos sin errores críticos                            |
|                                                                       |
| -   La latencia P95 no supera los 800 ms bajo carga de 500 usuarios   |
+-----------------------------------------------------------------------+
| **Verificación Gherkin (ISO/IEC 25010:2023)**                         |
+-----------------------------------------------------------------------+
| **Feature: RNF-PERF-02 · Capacidad concurrente**                      |
|                                                                       |
| **Scenario: Sistema estable con 500 usuarios concurrentes**           |
|                                                                       |
| > **Given** se simulan 500 usuarios concurrentes con k6 durante 5     |
| > minutos                                                             |
| >                                                                     |
| > **When** cada usuario realiza peticiones continuas al sistema       |
| >                                                                     |
| > **Then** no se producen errores HTTP 500 ni 503                     |
| >                                                                     |
| > **And** la latencia P95 no supera los 800 ms                        |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **RNF-SEG-01 --- Cifrado de datos en tránsito y en reposo**           |
+=======================================================================+
| **Categoría ISO/IEC 25010:2023: Seguridad Subcaracterística:**        |
| Confidencialidad + Integridad (ISO/IEC 25010:2023 §4.2.1, §4.2.3)     |
| **Prioridad: Crítica**                                                |
+-----------------------------------------------------------------------+
| **Descripción**                                                       |
|                                                                       |
| Toda comunicación entre cliente y servidor debe usar TLS 1.3. Los     |
| datos sensibles en reposo (contraseñas, tokens, datos personales)     |
| deben cifrarse con AES-256. Las contraseñas nunca deben almacenarse   |
| en texto plano; deben hashearse con bcrypt con factor de costo ≥ 12.  |
+-----------------------------------------------------------------------+
| **Métricas de verificación**                                          |
|                                                                       |
| -   SSL Labs score ≥ A en todos los endpoints públicos                |
|                                                                       |
| -   bcrypt cost factor ≥ 12 en todas las contraseñas almacenadas      |
|                                                                       |
| -   Sin columnas de contraseña en texto plano verificado con          |
|     auditoría de base de datos                                        |
|                                                                       |
| -   0 vulnerabilidades críticas en pruebas de penetración básica      |
+-----------------------------------------------------------------------+
| **Criterios de aceptación**                                           |
|                                                                       |
| -   Cumplimiento de estándares de cifrado verificado mediante         |
|     auditoría de seguridad                                            |
|                                                                       |
| -   Ningún endpoint acepta conexiones HTTP sin cifrar                 |
|                                                                       |
| -   Las contraseñas se almacenan siempre hasheadas con bcrypt         |
+-----------------------------------------------------------------------+
| **Verificación Gherkin (ISO/IEC 25010:2023)**                         |
+-----------------------------------------------------------------------+
| **Feature: RNF-SEG-01 · Cifrado**                                     |
|                                                                       |
| **Scenario: Toda comunicación usa TLS 1.3**                           |
|                                                                       |
| > **Given** el sistema está desplegado en producción                  |
| >                                                                     |
| > **When** se analiza con SSL Labs                                    |
| >                                                                     |
| > **Then** el reporte muestra calificación \"A\" o superior           |
| >                                                                     |
| > **And** ningún endpoint acepta conexiones HTTP sin cifrar           |
|                                                                       |
| **Scenario: Las contraseñas se almacenan hasheadas con bcrypt**       |
|                                                                       |
| > **Given** un usuario registra una contraseña                        |
| >                                                                     |
| > **When** se consulta directamente la base de datos                  |
| >                                                                     |
| > **Then** el campo password_hash contiene un hash bcrypt comenzando  |
| > con \"\$2b\$\"                                                      |
| >                                                                     |
| > **And** no existe ninguna columna password con texto plano          |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **RNF-SEG-02 --- Control de acceso basado en roles (RBAC)**           |
+=======================================================================+
| **Categoría ISO/IEC 25010:2023: Seguridad Subcaracterística:**        |
| Autenticidad + Responsabilidad (ISO/IEC 25010:2023 §4.2.4, §4.2.5)    |
| **Prioridad: Crítica**                                                |
+-----------------------------------------------------------------------+
| **Descripción**                                                       |
|                                                                       |
| El sistema debe implementar RBAC con tres roles: Comunidad            |
| Universitaria, Personal Administrativo y Administrador de Seguridad.  |
| Cada endpoint y vista debe verificar el rol del JWT antes de procesar |
| la solicitud. Un usuario no puede acceder a recursos de un rol        |
| superior al suyo.                                                     |
+-----------------------------------------------------------------------+
| **Métricas de verificación**                                          |
|                                                                       |
| -   100% de endpoints protegidos con middleware de autorización       |
|                                                                       |
| -   0 escalaciones de privilegio detectadas en pruebas de penetración |
|     básica                                                            |
|                                                                       |
| -   Cada cambio de estado de incidente queda registrado con el        |
|     identificador del administrador responsable                       |
+-----------------------------------------------------------------------+
| **Criterios de aceptación**                                           |
|                                                                       |
| -   Ningún usuario de rol Comunidad puede acceder a endpoints de      |
|     administración                                                    |
|                                                                       |
| -   El historial de acciones administrativas es auditable en el 100%  |
|     de los casos                                                      |
+-----------------------------------------------------------------------+
| **Verificación Gherkin (ISO/IEC 25010:2023)**                         |
+-----------------------------------------------------------------------+
| **Feature: RNF-SEG-02 · RBAC**                                        |
|                                                                       |
| **Scenario: Usuario Comunidad no accede al panel de administrador**   |
|                                                                       |
| > **Given** el usuario autenticado tiene rol \"community\"            |
| >                                                                     |
| > **When** intenta acceder a GET /api/admin/incidents                 |
| >                                                                     |
| > **Then** el servidor responde con código 403 Forbidden              |
| >                                                                     |
| > **And** no devuelve ningún dato del endpoint restringido            |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **RNF-SEG-03 --- Anonimización de datos geoespaciales**               |
+=======================================================================+
| **Categoría ISO/IEC 25010:2023: Seguridad Subcaracterística:**        |
| Confidencialidad + Privacidad (ISO/IEC 25010:2023 §4.2.1, §4.2.2)     |
| **Prioridad: Alta**                                                   |
+-----------------------------------------------------------------------+
| **Descripción**                                                       |
|                                                                       |
| Las coordenadas GPS exactas de los usuarios no deben ser visibles en  |
| ningún panel público o compartido. En el mapa de avistamientos        |
| comunitarios, la ubicación del reportante debe truncarse a una        |
| precisión de 3 decimales (±100 m) antes de almacenarse.               |
+-----------------------------------------------------------------------+
| **Métricas de verificación**                                          |
|                                                                       |
| -   Precisión máxima de coordenadas en vistas públicas: 3 decimales   |
|     (±111 m)                                                          |
|                                                                       |
| -   0 trazas GPS exactas expuestas en endpoints de API pública        |
|                                                                       |
| -   Verificado mediante auditoría de payloads de respuesta            |
+-----------------------------------------------------------------------+
| **Criterios de aceptación**                                           |
|                                                                       |
| -   Las coordenadas en respuestas públicas nunca superan 3 decimales  |
|     de precisión                                                      |
|                                                                       |
| -   Solo los endpoints de administrador devuelven coordenadas con     |
|     precisión completa                                                |
+-----------------------------------------------------------------------+
| **Verificación Gherkin (ISO/IEC 25010:2023)**                         |
+-----------------------------------------------------------------------+
| **Feature: RNF-SEG-03 · Anonimización geoespacial**                   |
|                                                                       |
| **Scenario: Coordenadas truncadas en reportes públicos**              |
|                                                                       |
| > **Given** un usuario envía un reporte con coordenadas exactas lat:  |
| > 4.861234, lng: -74.034567                                           |
| >                                                                     |
| > **When** el endpoint público GET /api/map/incidents devuelve el     |
| > reporte                                                             |
| >                                                                     |
| > **Then** las coordenadas en el payload son lat: 4.861, lng: -74.034 |
| >                                                                     |
| > **And** solo el endpoint de administrador devuelve la precisión     |
| > completa                                                            |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **RNF-USE-01 --- Usabilidad en dispositivos móviles**                 |
+=======================================================================+
| **Categoría ISO/IEC 25010:2023: Usabilidad Subcaracterística:**       |
| Operabilidad + Protección ante errores (ISO/IEC 25010:2023 §4.4.3,    |
| §4.4.5) **Prioridad: Alta**                                           |
+-----------------------------------------------------------------------+
| **Descripción**                                                       |
|                                                                       |
| El flujo de reporte de incidente debe ser completable por un usuario  |
| nuevo sin instrucción previa en menos de 60 segundos en un            |
| dispositivo móvil. Todos los elementos táctiles interactivos deben    |
| tener un área mínima de toque de 44×44 px (Apple HIG / Material       |
| Design).                                                              |
+-----------------------------------------------------------------------+
| **Métricas de verificación**                                          |
|                                                                       |
| -   Task completion rate ≥ 90% en test de usabilidad con 5 usuarios   |
|     nuevos                                                            |
|                                                                       |
| -   Tiempo promedio de tarea ≤ 60 segundos para completar un reporte  |
|                                                                       |
| -   0 elementos táctiles menores a 44×44 px                           |
+-----------------------------------------------------------------------+
| **Criterios de aceptación**                                           |
|                                                                       |
| -   Usuarios nuevos completan el flujo de reporte en menos de 60      |
|     segundos sin asistencia externa en el 90% de los casos            |
|                                                                       |
| -   Todas las acciones principales se completan con un máximo de 3    |
|     interacciones                                                     |
+-----------------------------------------------------------------------+
| **Verificación Gherkin (ISO/IEC 25010:2023)**                         |
+-----------------------------------------------------------------------+
| **Feature: RNF-USE-01 · Usabilidad mobile**                           |
|                                                                       |
| **Scenario: Usuario nuevo completa reporte en menos de 60 segundos**  |
|                                                                       |
| > **Given** un usuario sin experiencia previa tiene la app abierta en |
| > el módulo de reporte                                                |
| >                                                                     |
| > **When** se le pide reportar un incidente de tipo \"Zona oscura\"   |
| > sin instrucción                                                     |
| >                                                                     |
| > **Then** completa el flujo de 3 pasos en menos de 60 segundos       |
| >                                                                     |
| > **And** no requiere ayuda externa para completar la tarea           |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **RNF-USE-02 --- Accesibilidad WCAG 2.1 nivel AA**                    |
+=======================================================================+
| **Categoría ISO/IEC 25010:2023: Usabilidad Subcaracterística:**       |
| Accesibilidad (ISO/IEC 25010:2023 §4.4.7) **Prioridad: Media**        |
+-----------------------------------------------------------------------+
| **Descripción**                                                       |
|                                                                       |
| La versión web (PWA) de CampusShield debe cumplir con las pautas WCAG |
| 2.1 nivel AA en todas las vistas del usuario final. Esto incluye:     |
| contraste mínimo 4.5:1 para texto, navegación por teclado completa y  |
| etiquetas semánticas en todos los controles de formulario.            |
+-----------------------------------------------------------------------+
| **Métricas de verificación**                                          |
|                                                                       |
| -   0 violaciones WCAG 2.1 AA de nivel critical o serious en          |
|     auditoría con axe-core                                            |
|                                                                       |
| -   Score de accesibilidad Lighthouse ≥ 90 en vistas principales      |
|                                                                       |
| -   Navegación completa por teclado verificada manualmente en los     |
|     flujos críticos                                                   |
+-----------------------------------------------------------------------+
| **Criterios de aceptación**                                           |
|                                                                       |
| -   La auditoría automática con axe-core no reporta violaciones       |
|     críticas en ninguna vista principal                               |
|                                                                       |
| -   El score de accesibilidad de Lighthouse es igual o superior a 90  |
+-----------------------------------------------------------------------+
| **Verificación Gherkin (ISO/IEC 25010:2023)**                         |
+-----------------------------------------------------------------------+
| **Feature: RNF-USE-02 · Accesibilidad WCAG 2.1 AA**                   |
|                                                                       |
| **Scenario: Auditoría automática sin violaciones críticas**           |
|                                                                       |
| > **Given** la PWA está desplegada en staging                         |
| >                                                                     |
| > **When** se ejecuta una auditoría con axe-core sobre las vistas     |
| > principales                                                         |
| >                                                                     |
| > **Then** el reporte no muestra violaciones de nivel \"critical\" ni |
| > \"serious\"                                                         |
| >                                                                     |
| > **And** el score de accesibilidad de Lighthouse es igual o superior |
| > a 90                                                                |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **RNF-REL-01 --- Disponibilidad del sistema**                         |
+=======================================================================+
| **Categoría ISO/IEC 25010:2023: Fiabilidad Subcaracterística:**       |
| Disponibilidad (ISO/IEC 25010:2023 §4.3.1) **Prioridad: Muy alta**    |
+-----------------------------------------------------------------------+
| **Descripción**                                                       |
|                                                                       |
| El sistema debe mantener una disponibilidad de al menos 99% mensual   |
| durante el periodo del piloto universitario, equivalente a un máximo  |
| de 7.2 horas de caída mensual. Las ventanas de mantenimiento          |
| programado deben realizarse entre las 12am y las 6am y notificarse    |
| con 24 horas de anticipación.                                         |
+-----------------------------------------------------------------------+
| **Métricas de verificación**                                          |
|                                                                       |
| -   Uptime ≥ 99% mensual medido por monitor externo (UptimeRobot o    |
|     BetterUptime)                                                     |
|                                                                       |
| -   MTTR (Mean Time to Recovery) ≤ 30 minutos tras incidente          |
|                                                                       |
| -   Disponibilidad del sistema verificada en tiempo real con          |
|     dashboard de monitoreo                                            |
+-----------------------------------------------------------------------+
| **Criterios de aceptación**                                           |
|                                                                       |
| -   El sistema está disponible en todos los momentos críticos del     |
|     piloto                                                            |
|                                                                       |
| -   El tiempo total de caída no excede 432 minutos en ningún mes del  |
|     piloto                                                            |
+-----------------------------------------------------------------------+
| **Verificación Gherkin (ISO/IEC 25010:2023)**                         |
+-----------------------------------------------------------------------+
| **Feature: RNF-REL-01 · Disponibilidad**                              |
|                                                                       |
| **Scenario: Uptime mensual ≥ 99% verificado por monitor externo**     |
|                                                                       |
| > **Given** el sistema ha estado operativo durante un mes del piloto  |
| >                                                                     |
| > **When** se consulta el dashboard de UptimeRobot                    |
| >                                                                     |
| > **Then** el uptime del mes es igual o superior al 99%               |
| >                                                                     |
| > **And** el tiempo total de caída no excede 432 minutos en el mes    |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **RNF-REL-02 --- Funcionamiento offline parcial**                     |
+=======================================================================+
| **Categoría ISO/IEC 25010:2023: Fiabilidad Subcaracterística:**       |
| Tolerancia a fallos + Capacidad de recuperación (ISO/IEC 25010:2023   |
| §4.3.3, §4.3.4) **Prioridad: Alta**                                   |
+-----------------------------------------------------------------------+
| **Descripción**                                                       |
|                                                                       |
| En ausencia de conectividad, la app mobile debe permitir: visualizar  |
| el mapa en caché, acceder al historial de reportes locales y redactar |
| un nuevo reporte para enviarlo al recuperar la red. La PWA debe       |
| mostrar la última versión cacheada del mapa con indicador de modo     |
| offline.                                                              |
+-----------------------------------------------------------------------+
| **Métricas de verificación**                                          |
|                                                                       |
| -   Reporte offline encolado y sincronizado correctamente al          |
|     recuperar red en el 100% de las pruebas                           |
|                                                                       |
| -   Mapa cacheado visible en modo avión verificado manualmente en iOS |
|     y Android                                                         |
|                                                                       |
| -   Indicador de modo offline visible en la PWA cuando no hay         |
|     conexión                                                          |
+-----------------------------------------------------------------------+
| **Criterios de aceptación**                                           |
|                                                                       |
| -   El reporte encolado offline se envía automáticamente al recuperar |
|     conectividad sin pérdida de datos                                 |
|                                                                       |
| -   El mapa es visible en modo avión con los datos de la última       |
|     sesión con conexión                                               |
+-----------------------------------------------------------------------+
| **Verificación Gherkin (ISO/IEC 25010:2023)**                         |
+-----------------------------------------------------------------------+
| **Feature: RNF-REL-02 · Funcionamiento offline**                      |
|                                                                       |
| **Scenario: Reporte encolado offline se sincroniza al recuperar red** |
|                                                                       |
| > **Given** el dispositivo está en modo avión                         |
| >                                                                     |
| > **When** el usuario completa y envía un reporte                     |
| >                                                                     |
| > **Then** el reporte se guarda en cola local con estado              |
| > \"pendiente\"                                                       |
| >                                                                     |
| > **When** el dispositivo recupera conectividad                       |
| >                                                                     |
| > **Then** el reporte se envía automáticamente y el estado cambia a   |
| > \"enviado\"                                                         |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **RNF-MANT-01 --- Arquitectura modular con cobertura de tests**       |
+=======================================================================+
| **Categoría ISO/IEC 25010:2023: Mantenibilidad Subcaracterística:**   |
| Modularidad + Capacidad de modificación + Capacidad de prueba         |
| (ISO/IEC 25010:2023 §4.6.1, §4.6.4, §4.6.5) **Prioridad: Media**      |
+-----------------------------------------------------------------------+
| **Descripción**                                                       |
|                                                                       |
| El sistema debe organizarse en un monorepo con paquetes               |
| independientes por capa (web, mobile, api, ml, shared). La cobertura  |
| de tests de la capa de servicios del backend debe ser igual o         |
| superior al 70%. Cada módulo debe poder modificarse sin afectar a los |
| demás.                                                                |
+-----------------------------------------------------------------------+
| **Métricas de verificación**                                          |
|                                                                       |
| -   Cobertura de tests backend ≥ 70% medida con Jest \--coverage      |
|                                                                       |
| -   0 dependencias circulares entre paquetes del monorepo verificado  |
|     con herramienta de análisis                                       |
|                                                                       |
| -   El pipeline de CI falla automáticamente si la cobertura cae por   |
|     debajo del umbral                                                 |
+-----------------------------------------------------------------------+
| **Criterios de aceptación**                                           |
|                                                                       |
| -   Cambios en un módulo no rompen las pruebas de los demás módulos   |
|                                                                       |
| -   El pipeline de CI bloquea la fusión de PRs que reducen la         |
|     cobertura por debajo del 70%                                      |
+-----------------------------------------------------------------------+
| **Verificación Gherkin (ISO/IEC 25010:2023)**                         |
+-----------------------------------------------------------------------+
| **Feature: RNF-MANT-01 · Arquitectura modular**                       |
|                                                                       |
| **Scenario: Pipeline CI falla si cobertura cae por debajo del 70%**   |
|                                                                       |
| > **Given** el repositorio tiene configurado GitHub Actions con       |
| > reporte de cobertura                                                |
| >                                                                     |
| > **When** un PR reduce la cobertura del backend al 65%               |
| >                                                                     |
| > **Then** el pipeline de CI reporta fallo                            |
| >                                                                     |
| > **And** el PR no puede fusionarse hasta restaurar la cobertura      |
| > mínima                                                              |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **RNF-PORT-01 --- Compatibilidad multiplataforma web y mobile**       |
+=======================================================================+
| **Categoría ISO/IEC 25010:2023: Portabilidad Subcaracterística:**     |
| Adaptabilidad (ISO/IEC 25010:2023 §4.7.1) **Prioridad: Media**        |
+-----------------------------------------------------------------------+
| **Descripción**                                                       |
|                                                                       |
| La PWA debe funcionar correctamente en Chrome ≥ 100, Firefox ≥ 100,   |
| Safari ≥ 16 y Edge ≥ 100. La app mobile debe funcionar en iOS ≥ 15 y  |
| Android ≥ 10 (API level 29). El diseño responsive debe adaptarse      |
| correctamente a resoluciones desde 375 px hasta 1920 px de ancho.     |
+-----------------------------------------------------------------------+
| **Métricas de verificación**                                          |
|                                                                       |
| -   100% de flujos críticos verificados en las cuatro combinaciones   |
|     browser/OS principales                                            |
|                                                                       |
| -   0 errores de renderizado en resoluciones objetivo (375 px a 1920  |
|     px)                                                               |
|                                                                       |
| -   Verificado con BrowserStack o dispositivos físicos                |
|     representativos                                                   |
+-----------------------------------------------------------------------+
| **Criterios de aceptación**                                           |
|                                                                       |
| -   Todos los flujos críticos funcionan sin errores en los            |
|     navegadores y versiones de SO objetivo                            |
|                                                                       |
| -   No se producen errores de renderizado en ninguna resolución       |
|     objetivo                                                          |
+-----------------------------------------------------------------------+
| **Verificación Gherkin (ISO/IEC 25010:2023)**                         |
+-----------------------------------------------------------------------+
| **Feature: RNF-PORT-01 · Compatibilidad multiplataforma**             |
|                                                                       |
| **Scenario: Flujo de reporte funciona en Safari iOS 16**              |
|                                                                       |
| > **Given** el usuario tiene un iPhone con iOS 16 y Safari            |
| >                                                                     |
| > **When** accede a la PWA y completa el flujo de reporte             |
| >                                                                     |
| > **Then** el reporte se envía correctamente sin errores de consola   |
| >                                                                     |
| > **And** la captura de GPS funciona con el permiso solicitado        |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **RNF-COMP-01 --- Interoperabilidad con sistemas institucionales**    |
+=======================================================================+
| **Categoría ISO/IEC 25010:2023: Compatibilidad Subcaracterística:**   |
| Interoperabilidad (ISO/IEC 25010:2023 §4.8.2) **Prioridad: Baja**     |
+-----------------------------------------------------------------------+
| **Descripción**                                                       |
|                                                                       |
| El sistema debe exponer una API REST documentada con OpenAPI 3.0 que  |
| permita integración futura con los sistemas de información de la      |
| Universidad de La Sabana y de la Secretaría de Seguridad del          |
| municipio de Chía. La API debe usar JSON como formato de intercambio  |
| y autenticación OAuth2.                                               |
+-----------------------------------------------------------------------+
| **Métricas de verificación**                                          |
|                                                                       |
| -   100% de endpoints documentados en OpenAPI 3.0 sin errores de      |
|     validación                                                        |
|                                                                       |
| -   Colección Postman disponible para equipos integradores            |
|                                                                       |
| -   La especificación OpenAPI supera la validación de Swagger         |
|     Validator sin errores                                             |
+-----------------------------------------------------------------------+
| **Criterios de aceptación**                                           |
|                                                                       |
| -   La especificación OpenAPI 3.0 es válida y completa para todos los |
|     endpoints públicos                                                |
|                                                                       |
| -   Los sistemas externos pueden integrarse mediante la API           |
|     documentada sin requerir acceso al código fuente                  |
+-----------------------------------------------------------------------+
| **Verificación Gherkin (ISO/IEC 25010:2023)**                         |
+-----------------------------------------------------------------------+
| **Feature: RNF-COMP-01 · Interoperabilidad**                          |
|                                                                       |
| **Scenario: Especificación OpenAPI válida y completa**                |
|                                                                       |
| > **Given** la API está desplegada en staging                         |
| >                                                                     |
| > **When** se valida el archivo openapi.json con Swagger Validator    |
| >                                                                     |
| > **Then** el validador no reporta ningún error de esquema            |
| >                                                                     |
| > **And** todos los endpoints tienen descripción, parámetros          |
| > documentados y ejemplos de respuesta                                |
+-----------------------------------------------------------------------+

*Nota: Los umbrales numéricos de los RNF (latencia, disponibilidad,
cobertura) son valores iniciales para el piloto universitario y deben
revisarse con el equipo al iniciar la Fase 1, ajustándolos según las
capacidades reales de la infraestructura disponible. La versión ISO/IEC
25010:2023 (no la edición 2011) es la referencia normativa vigente para
este documento.*
