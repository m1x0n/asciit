<?php
/**
 * Created by PhpStorm.
 * User: antarus66
 * Date: 8/6/15
 * Time: 9:52 AM
 */
namespace App\Services\Auth\Contracts;

interface AuthServiceInterface
{
    public function authenticate($data);

    public function logout();

    public function getUser();

    public function getUserFromCookie($cookie);

    public function updateUser($data, $id);

    public function updateUserRole($newRoleId, $userId);

    public function getAllUsers($pageSize);

    public function getAllRoles();
}