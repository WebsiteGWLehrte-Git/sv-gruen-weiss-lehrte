<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // Honeypot für Bots
    $honeypot = $_POST['website'] ?? '';
    if(!empty($honeypot)) exit; // Bot erkannt

    // Ziel-Mailadresse
    $to = "peter.wilbers@web.de"; // <--- hier ersetzen

    $subject = "Kontaktformular Anfrage";

    // Formularwerte sicher einlesen
    $vorname = htmlspecialchars(trim($_POST['vorname']));
    $nachname = htmlspecialchars(trim($_POST['nachname']));
    $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
    $telefon = htmlspecialchars(trim($_POST['telefon'] ?? ''));
    $nachricht = htmlspecialchars(trim($_POST['nachricht']));

    // Pflichtfelder prüfen
    if(!$vorname || !$nachname || !$email || !$nachricht) {
        echo "Bitte alle Pflichtfelder ausfüllen.";
        exit;
    }

    // Nachricht zusammenstellen
    $body = "Neue Anfrage vom Kontaktformular:\n\n";
    $body .= "Vorname: $vorname\n";
    $body .= "Nachname: $nachnach\n";
    $body .= "E-Mail: $email\n";
    $body .= "Telefon: $telefon\n";
    $body .= "Nachricht:\n$nachricht\n";

    // Header
    $headers = "From: $email\r\nReply-To: $email";

    // Mail senden
    if(mail($to, $subject, $body, $headers)) {
        echo "Vielen Dank für Ihre Nachricht!";
    } else {
        echo "Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es später.";
    }
}
?>