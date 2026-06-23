<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::find(1);
$conversation = App\Models\Conversation::find(1);
if (!$user || !$conversation) {
    die("User or Conversation not found\n");
}

$request = Illuminate\Http\Request::create('/chat/conversations/1/messages', 'GET');
$request->setUserResolver(function() use ($user) { return $user; });

$controller = app(App\Http\Controllers\ChatController::class);
try {
    $response = $controller->messages($request, $conversation);
    echo json_encode(json_decode($response->getContent()), JSON_PRETTY_PRINT);
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n" . $e->getTraceAsString();
}
