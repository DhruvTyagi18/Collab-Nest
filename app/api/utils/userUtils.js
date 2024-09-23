function checkUserRole(session,orgId) {
    if (
      !session ||
      !session.user ||
      !session.user.organizationMemberships ||
      session.user.organizationMemberships.length === 0
    ) {
      return null; // Return null if the user is not a basic member
    }
  
    const organizationMemberships = session.user.organizationMemberships;
  
    // Loop through all organization memberships
    for (const membership of organizationMemberships) {
      // console.log("Outside: ",membership.role.toLowerCase());
      // console.log("Outside comp orgId: ",membership.organization.id);
      // console.log("Outside orgId: ",orgId);
      if (membership.role && membership.organization.id === orgId) {
        return membership.role.toLowerCase(); // Return the role in lowercase if it exists
      }
    }

  
    return null; // Return null if no role is found in the memberships
  }
  
  export { checkUserRole };