Estructura de secciones recomendada
1.	La Terminal de Despegue (Hero Section):
     o	Es la pantalla inicial de bienvenida.
     o	Muestra un eslogan futurista e impactante y mi marca personal a la izquierda del UI "NAFRABACE"
     o	El video de Google Flow empieza estático (ej. la nave encendida en la plataforma de lanzamiento).
2.	Catálogo de Destinos (The Map):
     o	Cuadrícula con las opciones de viaje (ej. Órbita baja terrestre, Hoteles en la Luna, Campamentos mineros en Marte, Cruceros por los anillos de Saturno).
     o	Al hacer scroll hacia aquí, el video muestra el despegue inicial y la salida de la atmósfera.
3.	Flota Estelar (The Fleet):
     o	Tarjetas técnicas con las especificaciones de las naves (motores de fusión, gravedad simulada, suites de lujo).
     o	El video en scroll puede mostrar la transición de la nave desplegando sus paneles solares o acelerando en el vacío hiperespacial.
4.	Entrenamiento y Requisitos (The Academy):
     o	Sección de info-entretenimiento que explica la preparación física, simuladores de fuerza G y las pruebas psicológicas obligatorias para los civiles.
5.	Protocolo de Seguridad y Soporte (Life Support):
     o	Datos interactivos de trajes espaciales y sistemas de soporte vital. Es ideal para poner widgets futuristas o gráficos de telemetría de código abierto falsos creados en el IDE.
6.	Reseñas de Crononautas (Testimonials):
     o	Comentarios ficticios de magnates, científicos o turistas que ya regresaron de sus vacaciones interplanetarias.
7.	Reserva tu Pasaje (Check-in / CTA):
     o	El formulario final para elegir fecha de lanzamiento, clase de pasaje (Económica Orbital o Primera Clase Galáctica) y método de pago (créditos espaciales).
     o	Aquí el video llega a su fotograma final: la nave llegando a destino con una vista cinematográfica.


Prompt

Crea una landing page de una sola página para una agencia de viajes espaciales ficticia utilizando HTML5 CSS4 semántico y JS(ES6+). 
La estructura debe incluir 7 secciones verticales con fondo transparente: Hero, Destinos, Flota, Academia, Testimonios y Reserva.
Cada sección debe tener una altura mínima de 100vh para permitir el scroll.

En el fondo de la web, implementa un elemento <canvas> con posición 'fixed' y 'z-index: -1' que ocupe todo el viewport.
Escribe un script en JavaScript que precargue una secuencia de 217 imágenes en formato JPG ubicadas en la ruta '/assets/space-scroll/frame_000.jpg' hasta el final la imagen "footer_nafrabace" tiene que ser la ultima con la seccion reservas.
Vincula el progreso del scroll general de la página para que dibuje el fotograma correspondiente en el canvas de manera fluida (efecto interpolado).
Asegúrate de que el diseño sea responsive, que los textos tengan un contraste alto sobre el canvas utilizando un sutil degradado oscuro y añade soporte para la media query 'prefers-reduced-motion' para desactivar la animación si el usuario lo requiere.


