<?php

namespace Drupal\team_manager\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\node\Entity\Node;

class TeamManagerController extends ControllerBase {
  public function updateWeights(Request $request) {
    $content = json_decode($request->getContent(), true);
    $responses = [];
    foreach ($content['items'] as $item) {
      // Überprüfen, ob die ID des Elements gesetzt und nicht leer ist
      if (!empty($item['id'])) {
        $node = Node::load($item['id']);
        if ($node) {
          // Setze das Gewicht entsprechend der neuen Reihenfolge
          $node->set('field_gewichtung_value', $item['index']); // 'index' verwenden
          // Speichere den Knoten
          $node->save();
          $responses[] = ['id' => $item['id'], 'status' => 'updated'];
        }
      } else {
        // Füge eine Meldung hinzu, dass die ID ungültig ist
        $responses[] = ['id' => null, 'status' => 'error', 'message' => 'Invalid ID'];
      }
    }
    return new JsonResponse(['status' => 'success', 'message' => 'Weights updated successfully', 'details' => $responses]);
  }
}
