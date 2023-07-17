import {Alert, Heading, Loader, Table, ToggleGroup} from '@navikt/ds-react'
import styles from './SaksoversiktPage.module.css'
const SaksoversiktPage = () => {

    const data = {}
    const error = true
    const søkere:Array<string> = []
    const kanSorteres = søkere && søkere?.length > 1;

    if (!data) {
        return (
            <div className={styles.loader}>
                <Loader size={'2xlarge'} />
                {error && (
                    <Alert variant={'error'} className={styles.warning}>
                        Det oppstod en feil under henting av data. Prøver på nytt...
                    </Alert>
                )}
            </div>
        );
    }

    return (
        <div className={styles.main__content}>
        <section className={styles.saksliste__innhold}>
            <Heading size={'large'} level={'1'}>
                Oppgaver AAP
            </Heading>
            <Table size={'medium'} className={styles.saksliste__tabell} zebraStripes>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader sortable={kanSorteres} sortKey={'søknadsdato'}>
                            Søknad
                        </Table.ColumnHeader>
                        <Table.ColumnHeader sortable={kanSorteres} sortKey={'pid'}>
                            Bruker
                        </Table.ColumnHeader>
                        <Table.ColumnHeader sortable={kanSorteres} sortKey={'status'}>
                            Status
                        </Table.ColumnHeader>
                        <Table.ColumnHeader sortable={kanSorteres} sortKey={'sakstype'}>
                            AAP
                        </Table.ColumnHeader>
                        <Table.ColumnHeader>Siste versjon</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                {/*<Table.Body>{tabellInnhold()}</Table.Body>*/}
            </Table>


        </section>
        </div>
    )

}

export default SaksoversiktPage