# **Resumen**

Este proyecto presenta una arquitectura escalable de monitoreo ambiental basada en una red de sensores distribuida. Utilizando un servidor central (Raspberry Pi) y diversos puntos de medición en el campus, se recopilan variables como CO₂, temperatura, humedad, nivel de ruido y luz UV. Estos datos permiten evaluar la calidad del ambiente en espacios abiertos y cerrados, analizar patrones de comportamiento humano y sentar las bases para modelos predictivos mediante técnicas de aprendizaje automático. El sistema proporciona una plataforma abierta y extensible para estudios ambientales dentro del Tecnológico de Monterrey, campus Guadalajara.

---

# **Introducción**

**SKILIKET 2.0** es una red de sensores interconectados que obtiene métricas ambientales dentro del Tecnológico de Monterrey, campus Guadalajara. Su objetivo es caracterizar la calidad del ambiente en diferentes zonas del campus, identificar patrones asociados a la ocupación de personas y analizar la evolución de estas variables a lo largo del tiempo.

A diferencia de implementaciones tradicionales que solo visualizan datos, este proyecto propone una plataforma sólida para **análisis estadístico**, **detección de tendencias** y **modelos predictivos**, permitiendo transformar mediciones simples en información útil para toma de decisiones, investigación ambiental y proyectos de ciencia ciudadana.

La necesidad surge de la falta de datos ambientales sistemáticos en espacios educativos, donde factores como el CO₂, el ruido, la ventilación y en general, la saturacion de espacios cerrados, pueden afectar la salud, el rendimiento académico o la percepción del entorno. Sustentamos el proyecto al demostrar que es posible implementar una solución **de bajo costo**, **escalable** y **abierta**, capaz de generar datos con valor real para investigadores, alumnos y autoridades.

---

# **Metodología**

La metodología se estructuró en tres etapas:

### **1. Adquisición de datos**

* Se utilizó una **Raspberry Pi** equipada con sensores ambientales (CO₂, temperatura, humedad, ruido y luz UV).
* Las mediciones se realizaron en intervalos fijos (10–15 segundos), acumulando series temporales para su análisis.
* Los puntos de medición se colocaron en zonas representativas del campus para simular la futura red distribuida basada en ESP32.

### **2. Procesamiento y almacenamiento**

* Los datos capturados se almacenaron localmente en un formato estructurado (SQLite/CSV).
* Se realizó limpieza, normalización y etiquetado temporal para facilitar la visualización y el análisis estadístico.
* Se diseñó una arquitectura **escalable**, donde el RPi funcionará como gateway y los nodos ESP32 se integrarán posteriormente mediante MQTT.

### **3. Análisis y modelado predictivo**

* Se generaron estadísticas descriptivas de cada variable ambiental.
* Se evaluaron correlaciones entre ruido, CO₂ y ocupación estimada.
* Se implementó un modelo predictivo de regresión para estimar una variable ambiental futura a partir de datos históricos.
* El modelo alcanzó un **error cuadrático medio aproximado del 4%**, demostrando la viabilidad de aplicar aprendizaje automático al conjunto de datos del campus.

---

# **Resultados**

### **Resultados obtenidos**

Con las simulaciones realizadas mediante la Raspberry Pi se lograron:

* **Más de 300,000 observaciones ambientales** registradas en distintos horarios del día.
* Variaciones claras de CO₂ entre **450–900 ppm**, asociadas a cambios en la presencia de personas.
* Incrementos de ruido entre **+12 dB** y **+20 dB** durante horas de mayor actividad.
* Cambios en temperatura de **2–4 °C** en interiores parcialmente ventilados.
* Estabilidad en mediciones UV coherentes con la radiación solar del horario.

Estos datos permitieron crear modelos estadísticos y matemáticos para describir y predecir la dinámica ambiental y poblacional del campus.

### **Resultados esperados (arquitectura final)**

Al integrar múltiples nodos ESP32 en la red:

* Se obtendrá un dataset distribuido de mayor resolución espacial.
* Se podrán generar **mapas de calor ambientales** en tiempo real.
* Será posible estimar ocupación y confort ambiental por zonas.

### **Modelo predictivo**

El modelo inicial de regresión construido con los datos simulados logró:

* **Error cuadrático medio (MSE): ~4%**
* Capacidad de predecir tendencias de CO₂ y ruido con buena estabilidad.

Esto demuestra que la plataforma no solo recolecta datos, sino que también permite **predecir condiciones futuras del entorno**, abriendo la puerta a aplicaciones como detección temprana de áreas saturadas, recomendaciones de ventilación y análisis de comportamiento ambiental.

