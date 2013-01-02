package photodb.data.entity

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Table
import javax.persistence.UniqueConstraint

@Entity
@Table(name = 'group_tbl', uniqueConstraints = @UniqueConstraint(columnNames = ['grp_name']))
class Group extends BaseEntity {

    @Column(name = 'grp_name', nullable = false)
    String name

}
