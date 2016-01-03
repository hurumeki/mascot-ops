window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;

var recognition = new window.SpeechRecognition();
recognition.lang = 'ja';
recognition.maxAlternatives = 1;
recognition.continuous = true;
recognition.interimResults = true;

export default recognition;
