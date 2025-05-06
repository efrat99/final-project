import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const TermsOfService = ({ visible, onHide }) => {
    return (
        <Dialog header="תנאי שימוש" visible={visible} style={{ width: '50vw' }} onHide={onHide}>
            <div>
                <h4>תנאי השימוש שלנו</h4>
                <p>הכנס כאן את תנאי השימוש שלך...</p>
                <Button label="סגור" icon="pi pi-times" onClick={onHide} />
            </div>
        </Dialog>
    );
};

export default TermsOfService;
