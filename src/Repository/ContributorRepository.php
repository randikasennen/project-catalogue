<?php

namespace App\Repository;

use App\Entity\Contributor;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Contributor|null find($id, $lockMode = null, $lockVersion = null)
 * @method Contributor|null findOneBy(array $criteria, array $orderBy = null)
 * @method Contributor[]    findAll()
 * @method Contributor[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ContributorRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Contributor::class);
    }

    /**
     * @return Contributor Returns a Contributor object
     */
    public function findOneOrCreateIfNotExist($contributorData)
    {
        $contributor = $this->findOneBy(['login' => $contributorData['login']]);

        if(!$contributor) {
            $contributor = new Contributor();
            $contributor->setGithubId($contributorData['id']);
            $contributor->setLogin($contributorData['login']);
            $contributor->setAvatarUrl($contributorData['avatar_url']);
        }

        return $contributor;
    }

    // /**
    //  * @return Contributor[] Returns an array of Contributor objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Contributor
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
