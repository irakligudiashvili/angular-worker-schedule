﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.DTOs
{
    public class ChangeUserRoleDTO
    {
        public int UserId { get; set; }
        public int NewRoleId { get; set; }
    }
}
