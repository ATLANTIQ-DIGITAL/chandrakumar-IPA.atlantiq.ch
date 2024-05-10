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
      $node = Node::load($item['id']);
      if ($node) {
        $node->set('field_gewichtung', $item['weight']);
        $node->save();
        $responses[] = ['id' => $item['id'], 'status' => 'updated'];
      }
    }
    return new JsonResponse(['status' => 'success', 'message' => 'Weights updated successfully', 'details' => $responses]);
  }
}
