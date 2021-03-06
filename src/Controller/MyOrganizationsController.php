<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

/**
 * @IsGranted("IS_AUTHENTICATED_FULLY")
 */
class MyOrganizationsController extends AbstractController
{
    /**
     * @Route("/authuser/organizations", name="my_organizations")
     */
    public function index(): Response
    {
        $organizations = $this->getUser()->getOrganizations();

        return $this->render('my_organizations/index.html.twig', [
            'organizations' => $organizations,
        ]);
    }
}
